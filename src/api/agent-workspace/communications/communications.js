import { CommunicationTypeServiceApiFactory } from 'webitel-sdk';
import instance from '../../instance';
import configuration from '../../openAPIConfig';
import store from '../../../store/index';

const communicationService = new CommunicationTypeServiceApiFactory(configuration, '', instance);

const getCommunications = async (search) => {
  const page = 1;
  const size = 20;
  const { domainId } = store.state.userinfo;
  try {
    const response = await communicationService
      .searchCommunicationType(
        page,
        size,
        search,
        domainId,
      );
    return response.items || [];
  } catch (err) {
    throw err;
  }
};

export default getCommunications;
