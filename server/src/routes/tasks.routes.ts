import { Router } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { query } from '../db/connection';

const router = Router();

// 1. Get Project Tasks
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const { projectId } = req.query;
    let text = 'SELECT * FROM tasks WHERE 1=1';
    const params: any[] = [];

    if (projectId) {
      params.push(projectId);
      text += ` AND project_id = $${params.length}`;
    }

    text += ' ORDER BY created_at DESC';
    const tasksRes = await query(text, params);
    res.json({ success: true, tasks: tasksRes.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Create Task
router.post('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      projectId,
      title,
      description,
      workstream,
      priority,
      assigneeId,
      storyPoints,
      estimatedHours,
      dueDate,
    } = req.body;

    const countRes = await query('SELECT count(*) FROM tasks WHERE project_id = $1', [projectId]);
    const nextSeq = parseInt(countRes.rows[0].count) + 101;
    const taskKey = `TASK-${nextSeq}`;

    const insertRes = await query(
      `INSERT INTO tasks (project_id, key, title, description, workstream, priority, assignee_id, reporter_id, story_points, estimated_hours, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        projectId,
        taskKey,
        title,
        description,
        workstream || 'Software',
        priority || 'Medium',
        assigneeId,
        req.user?.id,
        storyPoints || 0,
        estimatedHours || 0,
        dueDate,
      ]
    );

    res.status(201).json({ success: true, task: insertRes.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Update Task Status & Trigger Escalation if Blocked
router.patch('/:id/status', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { status, approvalStatus } = req.body;

    const updateRes = await query(
      `UPDATE tasks SET status = COALESCE($1, status), approval_status = COALESCE($2, approval_status), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [status, approvalStatus, id]
    );

    const task = updateRes.rows[0];

    // If status became Blocked, trigger alert escalation
    if (status === 'Blocked') {
      await query(
        `INSERT INTO alert_escalations (task_id, current_stage, stage_label, severity, escalated_to_user_id, escalated_to_role, reason)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          task.id,
          2,
          'Stage 2: Disciplinary Team Lead',
          'critical',
          req.user?.id,
          'Team Lead',
          `Task ${task.key} marked as Blocked. Escalated to Team Lead.`,
        ]
      );
    }

    res.json({ success: true, task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
