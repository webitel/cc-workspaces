export const CallTab = {
  Numpad: 'numpad',
  Contacts: 'contacts',
  History: 'history',
  Transfer: 'transfer',
  Bridge: 'bridge',
} as const;

export type CallTabType = typeof CallTab[keyof typeof CallTab];

export default CallTab;
