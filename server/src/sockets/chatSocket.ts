import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import jwt from 'jsonwebtoken';

interface ClientConnection {
  ws: WebSocket;
  userId: string;
  organizationId: string;
}

const clients = new Map<string, ClientConnection>();

export const initWebSocketServer = (server: http.Server) => {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    // Authenticate via token in query string
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(4001, 'Authentication token required');
      return;
    }

    try {
      const secret = process.env.JWT_SECRET || 'your-256-bit-jwt-secret-key-placeholder-change-in-production';
      const user = jwt.verify(token, secret) as any;

      clients.set(user.id, { ws, userId: user.id, organizationId: user.organizationId });
      console.log(`WebSocket client connected: ${user.id} (${user.email})`);

      // Send connection acknowledgement
      ws.send(JSON.stringify({ type: 'CONNECTED', userId: user.id, timestamp: new Date().toISOString() }));

      ws.on('message', (data: string) => {
        try {
          const payload = JSON.parse(data.toString());

          if (payload.type === 'CHAT_MESSAGE') {
            // Broadcast message to recipients
            broadcastToConversation(payload.conversationId, payload.message);
          } else if (payload.type === 'TYPING') {
            broadcastToConversation(payload.conversationId, {
              type: 'TYPING',
              userId: user.id,
              isTyping: payload.isTyping,
            });
          }
        } catch (err) {
          console.error('WebSocket message parsing error:', err);
        }
      });

      ws.on('close', () => {
        clients.delete(user.id);
        console.log(`WebSocket client disconnected: ${user.id}`);
      });
    } catch (err) {
      ws.close(4002, 'Invalid authentication token');
    }
  });

  const broadcastToConversation = (conversationId: string, payload: any) => {
    const raw = JSON.stringify(payload);
    clients.forEach(({ ws }) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(raw);
      }
    });
  };

  return wss;
};
