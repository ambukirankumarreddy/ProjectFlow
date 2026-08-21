import {
  Conversation,
  ChatMessage,
  NotificationItem,
  NotificationPreferences,
  AlertEscalationRecord
} from '../types';

export const INITIAL_CONVERSATIONS: Conversation[] = [];

export const INITIAL_MESSAGES: ChatMessage[] = [];

export const INITIAL_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  masterVolume: 0.8,
  chatVolume: 0.8,
  alertVolume: 0.9,
  soundEnabled: true,
  soundOnlyForMentions: false,
  criticalAlertsOverrideDnd: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  dndActive: false,
  inAppEnabled: true,
  browserDesktopEnabled: true,
  mobilePushEnabled: true,
  emailEnabled: true,
  privacyMode: false,
};

export const INITIAL_NOTIFICATIONS_V2: NotificationItem[] = [];

export const INITIAL_ALERT_ESCALATIONS: AlertEscalationRecord[] = [];
