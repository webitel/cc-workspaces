import UserStatus from './UserStatus';

const parseUserStatus = (presence) => {
  if (presence && presence.status) {
    if (presence.status.includes('dnd')) {
      return UserStatus.DND;
    }
    if (presence.status.includes('web')) {
      return UserStatus.ACTIVE;
    }
  }
  return '';
};

export default parseUserStatus;
