/**
 * Chat status enum
 * Defines possible states for chat queue preview components
 */
export const ChatStatus = {
  New: 'new',
  Active: 'active',
  Closed: 'closed',
} as const;

/**
 * Type representing the values of ChatStatus
 */
export type ChatStatusType = typeof ChatStatus[keyof typeof ChatStatus];

export const ChatTypes = {
  Manual: 'manual',
}

/**
 * Chat status colors mapping
 * Maps each status to its corresponding color
 */
export const ChatColorsMap = {
  [ChatStatus.New]: 'success',
  [ChatStatus.Active]: 'warning',
  [ChatStatus.Closed]: 'disabled',
  [ChatTypes.Manual]: 'disabled',
} as const;
