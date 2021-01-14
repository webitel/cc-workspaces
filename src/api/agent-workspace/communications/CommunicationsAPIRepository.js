import { CommunicationTypeServiceApiFactory } from 'webitel-sdk';
import configuration from '../../openAPIConfig';
import instance from '../../instance';

const communicationService = new CommunicationTypeServiceApiFactory(configuration, '', instance);

const defaultParams = {
  page: 1,
  size: 10,
  search: '',
};

const getCommunicationTypes = async ({
                                     page,
                                     size,
                                     search,
                                     domainId,
                                   }) => {
  try {
    const response = await communicationService
      .searchCommunicationType(
        page,
        size,
        search,
        domainId,
      );
    return { next: !!response.next, items: response.items || [] };
  } catch (err) {
    throw err;
  }
};

const communicationsAPIRepository = {
  getCommunicationTypes(argParams) {
    const params = {
      ...defaultParams,
      ...argParams,
    };
    return getCommunicationTypes(params);
  },
};

export default communicationsAPIRepository;
