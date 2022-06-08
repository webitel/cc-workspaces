import UserStatus from './UserStatus';

const parseUserStatus = (presence) => {
  if (!presence || !presence.status) return UserStatus.OFFLINE;
  if (presence.status.includes('dnd')) return UserStatus.DND;
  if (presence.status.includes('dlg')) return UserStatus.BUSY;
  if (presence.status.includes('sip')
    || presence.status.includes('web')) return UserStatus.ACTIVE;
  return '';
};

export default parseUserStatus;
