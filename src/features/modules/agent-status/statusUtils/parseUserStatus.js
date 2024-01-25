import UserStatus from './UserStatus';

const parseUserStatus = (object, propertyName) => ({
  [UserStatus.DND]: object?.[propertyName]?.includes('dnd'),
  [UserStatus.BUSY]: object?.[propertyName]?.includes('dlg'),
  [UserStatus.SIP]: object?.[propertyName]?.includes('sip'),
  [UserStatus.WEB]: object?.[propertyName]?.includes('web'),
});
export default parseUserStatus;
