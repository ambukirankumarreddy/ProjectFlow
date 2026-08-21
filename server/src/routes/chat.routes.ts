import { Router } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { query } from '../db/connection';

const router = Router();

// 1. Get All User Conversations
router.get('/conversations', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const convRes = await query(
      `SELECT c.*,
              json_agg(cm.user_id) as member_ids
       FROM conversations c
       JOIN conversation_members cm ON c.id = cm.conversation_id
       WHERE c.organization_id = $1
       GROUP BY c.id
       ORDER BY c.updated_at DESC`,
      [req.user?.organizationId]
    );

    res.json({ success: true, conversations: convRes.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Get Messages for Conversation
router.get('/conversations/:id/messages', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const msgRes = await query(
      `SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
       FROM chat_messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC`,
      [id]
    );

    res.json({ success: true, messages: msgRes.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Post Message
router.post('/conversations/:id/messages', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { text, attachments, voiceNoteMetadata, replyToMessageId, mentions } = req.body;

    const insertRes = await query(
      `INSERT INTO chat_messages (conversation_id, sender_id, text, attachments, voice_note_metadata, reply_to_message_id, mentions)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        id,
        req.user?.id,
        text,
        JSON.stringify(attachments || []),
        JSON.stringify(voiceNoteMetadata || null),
        replyToMessageId,
        mentions || [],
      ]
    );

    // Update conversation updated_at
    await query('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);

    res.status(201).json({ success: true, message: insertRes.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
