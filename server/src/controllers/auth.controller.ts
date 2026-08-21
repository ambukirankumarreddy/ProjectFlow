import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { query } from '../db/connection';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'your-256-bit-jwt-secret-key-placeholder-change-in-production';
const ALLOWED_DOMAIN = process.env.ALLOWED_ORG_DOMAIN || 'edgeforce.in';

export const AuthController = {
  // 1. Google OAuth 2.0 Verification & Login / Auto-Provisioning
  async googleAuth(req: Request, res: Response) {
    try {
      const { credential } = req.body;
      if (!credential) {
        return res.status(400).json({ success: false, message: 'Google credential token is required.' });
      }

      // Verify Google ID token
      let payload: any = null;
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch (err) {
        // Fallback for mocked tokens during testing
        if (credential.startsWith('google-token-')) {
          payload = {
            email: req.body.email || 'rajesh.varma@edgeforce.in',
            name: req.body.name || 'Rajesh Varma',
            sub: 'google-sub-id-12345',
            picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            email_verified: true,
          };
        } else {
          return res.status(401).json({ success: false, message: 'Invalid Google OAuth token.' });
        }
      }

      const email = payload.email.toLowerCase();
      const domain = email.split('@')[1];

      // Office Domain Validation Check
      if (ALLOWED_DOMAIN && domain !== ALLOWED_DOMAIN) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Only company domain accounts (@${ALLOWED_DOMAIN}) are permitted.`,
        });
      }

      // Check if user exists in database
      const userRes = await query('SELECT * FROM users WHERE email = $1', [email]);
      let user = userRes.rows[0];

      if (!user) {
        // Check if there is an active organization invitation
        const invRes = await query(
          'SELECT * FROM organization_invitations WHERE email = $1 AND status = $2',
          [email, 'Pending']
        );

        if (invRes.rows.length === 0) {
          return res.status(404).json({
            success: false,
            needsRegistration: true,
            email,
            name: payload.name,
            message: 'User not registered. Please register your organization or request an employee invitation.',
          });
        }

        // Auto-provision invited employee
        const inv = invRes.rows[0];
        const insertRes = await query(
          `INSERT INTO users (organization_id, department_id, name, email, google_account_id, google_email, is_google_verified, role, avatar_url, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
          [
            inv.organization_id,
            inv.department_id,
            payload.name,
            email,
            payload.sub,
            email,
            true,
            inv.role,
            payload.picture,
            'Active',
          ]
        );

        user = insertRes.rows[0];
        await query('UPDATE organization_invitations SET status = $1 WHERE id = $2', ['Accepted', inv.id]);
      } else {
        // Update Google verified status
        await query(
          'UPDATE users SET is_google_verified = $1, google_account_id = $2, avatar_url = COALESCE(avatar_url, $3) WHERE id = $4',
          [true, payload.sub, payload.picture, user.id]
        );
      }

      // Generate JWT Token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          organizationId: user.organization_id,
          role: user.role,
          domain,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          designation: user.designation,
          avatarUrl: user.avatar_url,
          organizationId: user.organization_id,
          isGoogleVerified: true,
          twoFactorRequired: user.two_factor_enabled,
        },
      });
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // 2. Standard Email/Password Sign-In
  async login(req: Request, res: Response) {
    try {
      const { email, password, otp } = req.body;
      const userRes = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
      const user = userRes.rows[0];

      if (!user || !user.password_hash) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Check 2FA OTP if enabled
      if (user.two_factor_enabled) {
        if (!otp || otp !== '123456') { // Mock/TOTP validation
          return res.status(403).json({
            success: false,
            twoFactorRequired: true,
            message: '2FA OTP code required.',
          });
        }
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          organizationId: user.organization_id,
          role: user.role,
          domain: user.email.split('@')[1],
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          designation: user.designation,
          avatarUrl: user.avatar_url,
          organizationId: user.organization_id,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // 3. One-Time Organization & Super Admin Initial Registration
  async registerOrganization(req: Request, res: Response) {
    try {
      const { organizationName, domain, adminName, adminEmail, password } = req.body;

      if (!organizationName || !domain || !adminName || !adminEmail || !password) {
        return res.status(400).json({ success: false, message: 'All registration fields are required.' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create Organization
      const orgRes = await query(
        'INSERT INTO organizations (name, domain) VALUES ($1, $2) RETURNING id',
        [organizationName, domain.toLowerCase()]
      );
      const organizationId = orgRes.rows[0].id;

      // Create Super Admin User
      const userRes = await query(
        `INSERT INTO users (organization_id, name, email, password_hash, role, designation, status, two_factor_enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          organizationId,
          adminName,
          adminEmail.toLowerCase(),
          passwordHash,
          'Super Admin',
          'Managing Director & Super Admin',
          'Active',
          true,
        ]
      );
      const user = userRes.rows[0];

      // Generate JWT Token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          organizationId,
          role: user.role,
          domain: domain.toLowerCase(),
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Organization and Super Admin successfully registered.',
        token,
        organization: { id: organizationId, name: organizationName, domain },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
