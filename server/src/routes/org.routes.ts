import { Router } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/role.middleware';
import { query } from '../db/connection';
import crypto from 'crypto';

const router = Router();

// 1. Get Organization Details
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const orgRes = await query('SELECT * FROM organizations WHERE id = $1', [req.user?.organizationId]);
    res.json({ success: true, organization: orgRes.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Invite Employee with Role & Department
router.post(
  '/invitations',
  authenticateJWT,
  requireRoles(['Super Admin', 'Organization Admin', 'Project Manager']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { email, role, departmentId } = req.body;
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const invRes = await query(
        `INSERT INTO organization_invitations (organization_id, invited_by_user_id, email, role, department_id, invitation_token, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [req.user?.organizationId, req.user?.id, email.toLowerCase(), role, departmentId, token, expiresAt]
      );

      res.status(201).json({
        success: true,
        message: `Invitation generated for ${email}`,
        invitation: invRes.rows[0],
        inviteUrl: `${process.env.FRONTEND_URL}/register?token=${token}`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
