import MessengerType from 'webitel-sdk/esm2015/enums/messenger-type.enum';
export default function(messengerType) {
  switch (messengerType) {
    case MessengerType.TELEGRAM:
      return 'messenger-telegram';
    case MessengerType.VIBER:
      return 'messenger-viber';
    case 'whatsapp':
      return 'messenger-whatsapp';
    case MessengerType.WEB_CHAT:
      return 'messenger-web-chat';
    case MessengerType.INSTAGRAM:
      return 'instagram';
    case 'facebook':
      return 'messenger-facebook';
    case 'custom':
      return 'messenger-custom';
    default:
      return messengerType;
  }
};
