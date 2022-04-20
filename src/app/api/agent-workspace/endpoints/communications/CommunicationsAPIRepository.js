import { CommunicationTypeServiceApiFactory } from 'webitel-sdk';
import { SdkListGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import configuration from '../../../openAPIConfig';
import instance from '../../../instance';

const communicationService = new CommunicationTypeServiceApiFactory(configuration, '', instance);

const listGetter = new SdkListGetterApiConsumer(communicationService.searchCommunicationType);

const getCommunicationsList = (params) => listGetter.getList(params);

const communicationsAPIRepository = {
  getList: getCommunicationsList,
};

export default communicationsAPIRepository;
