import { Router } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/role.middleware';
import { query } from '../db/connection';

const router = Router();

// 1. Get All Organization Users with 3-Tier Hierarchy
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const usersRes = await query(
      `SELECT u.id, u.name, u.email, u.role, u.designation, u.avatar_url, u.status,
              u.hourly_rate_inr, u.functional_manager_id, u.project_lead_id, u.administrative_manager_id,
              d.name as department_name,
              fm.name as functional_manager_name,
              pl.name as project_lead_name,
              am.name as administrative_manager_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN users fm ON u.functional_manager_id = fm.id
       LEFT JOIN users pl ON u.project_lead_id = pl.id
       LEFT JOIN users am ON u.administrative_manager_id = am.id
       WHERE u.organization_id = $1
       ORDER BY u.created_at ASC`,
      [req.user?.organizationId]
    );

    res.json({ success: true, users: usersRes.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Update User Reporting Managers & Role
router.patch(
  '/:id/reporting-managers',
  authenticateJWT,
  requireRoles(['Super Admin', 'Organization Admin', 'Project Manager']),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { functionalManagerId, projectLeadId, administrativeManagerId, role, designation } = req.body;

      const updateRes = await query(
        `UPDATE users
         SET functional_manager_id = COALESCE($1, functional_manager_id),
             project_lead_id = COALESCE($2, project_lead_id),
             administrative_manager_id = COALESCE($3, administrative_manager_id),
             role = COALESCE($4, role),
             designation = COALESCE($5, designation),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 AND organization_id = $7
         RETURNING *`,
        [functionalManagerId, projectLeadId, administrativeManagerId, role, designation, id, req.user?.organizationId]
      );

      res.json({ success: true, message: 'Reporting hierarchy updated.', user: updateRes.rows[0] });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
