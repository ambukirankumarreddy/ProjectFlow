import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Public Authentication Routes
router.post('/google', AuthController.googleAuth);
router.post('/login', AuthController.login);
router.post('/register-organization', AuthController.registerOrganization);

// Protected Verification Route
router.get('/me', authenticateJWT, (req: any, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
