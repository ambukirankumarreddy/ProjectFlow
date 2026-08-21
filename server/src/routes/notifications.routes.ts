import { Router } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { query } from '../db/connection';

const router = Router();

// 1. Get User Notifications
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const notifsRes = await query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user?.id]
    );
    res.json({ success: true, notifications: notifsRes.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Mark Notification as Read
router.patch('/:id/read', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2', [id, req.user?.id]);
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Mark All Notifications as Read
router.post('/mark-all-read', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    await query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.user?.id]);
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Get & Update Notification Preferences
router.get('/preferences', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const prefRes = await query('SELECT * FROM notification_preferences WHERE user_id = $1', [req.user?.id]);
    res.json({ success: true, preferences: prefRes.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/preferences', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      masterVolume,
      chatVolume,
      alertVolume,
      soundEnabled,
      soundOnlyForMentions,
      criticalAlertsOverrideDnd,
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
      dndActive,
      inAppEnabled,
      browserDesktopEnabled,
      mobilePushEnabled,
      emailEnabled,
      privacyMode,
    } = req.body;

    const upsertRes = await query(
      `INSERT INTO notification_preferences (
         user_id, master_volume, chat_volume, alert_volume, sound_enabled,
         sound_only_for_mentions, critical_alerts_override_dnd, quiet_hours_enabled,
         quiet_hours_start, quiet_hours_end, dnd_active, in_app_enabled,
         browser_desktop_enabled, mobile_push_enabled, email_enabled, privacy_mode
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       ON CONFLICT (user_id) DO UPDATE SET
         master_volume = EXCLUDED.master_volume,
         chat_volume = EXCLUDED.chat_volume,
         alert_volume = EXCLUDED.alert_volume,
         sound_enabled = EXCLUDED.sound_enabled,
         sound_only_for_mentions = EXCLUDED.sound_only_for_mentions,
         critical_alerts_override_dnd = EXCLUDED.critical_alerts_override_dnd,
         quiet_hours_enabled = EXCLUDED.quiet_hours_enabled,
         quiet_hours_start = EXCLUDED.quiet_hours_start,
         quiet_hours_end = EXCLUDED.quiet_hours_end,
         dnd_active = EXCLUDED.dnd_active,
         in_app_enabled = EXCLUDED.in_app_enabled,
         browser_desktop_enabled = EXCLUDED.browser_desktop_enabled,
         mobile_push_enabled = EXCLUDED.mobile_push_enabled,
         email_enabled = EXCLUDED.email_enabled,
         privacy_mode = EXCLUDED.privacy_mode
       RETURNING *`,
      [
        req.user?.id,
        masterVolume,
        chatVolume,
        alertVolume,
        soundEnabled,
        soundOnlyForMentions,
        criticalAlertsOverrideDnd,
        quietHoursEnabled,
        quietHoursStart,
        quietHoursEnd,
        dndActive,
        inAppEnabled,
        browserDesktopEnabled,
        mobilePushEnabled,
        emailEnabled,
        privacyMode,
      ]
    );

    res.json({ success: true, preferences: upsertRes.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Alert Escalations
router.get('/escalations', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const escRes = await query(
      `SELECT e.*, t.key as task_key, t.title as task_title, u.name as escalated_to_user_name
       FROM alert_escalations e
       JOIN tasks t ON e.task_id = t.id
       JOIN users u ON e.escalated_to_user_id = u.id
       ORDER BY e.created_at DESC`
    );
    res.json({ success: true, escalations: escRes.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
