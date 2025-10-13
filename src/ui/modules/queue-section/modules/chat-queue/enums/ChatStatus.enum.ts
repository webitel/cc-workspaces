/**
 * Chat status enum
 * Defines possible states for chat queue preview components
 */
export const ChatStatus = {
  NEW: 'new',
  ACTIVE: 'active',
  CLOSED: 'closed',
} as const;

/**
 * Type representing the values of ChatStatus
 */
export type ChatStatusType = typeof ChatStatus[keyof typeof ChatStatus];

export const ChatTypes = {
  MANUAL: 'manual',
}

/**
 * Chat status colors mapping
 * Maps each status to its corresponding color
 */
export const CHAT_COLORS = {
  [ChatStatus.NEW]: 'success',
  [ChatStatus.ACTIVE]: 'warning',
  [ChatTypes.MANUAL]: 'secondary',
  [ChatStatus.CLOSED]: 'secondary',
} as const;
