export const VideoCallTab = {
  Processing: 'processing',
  Contacts: 'contacts',
  History: 'history',
  Transfer: 'transfer',
} as const;

export type VideoCallTabType = typeof VideoCallTab[keyof typeof VideoCallTab];
