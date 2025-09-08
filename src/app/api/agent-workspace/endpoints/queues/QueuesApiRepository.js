import { getDefaultGetListResponse, getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import deepCopy from 'deep-copy';
import { QueueServiceApiFactory } from 'webitel-sdk';

import instance from '../../../../../app/api/instance';
import configuration from '../../../../../app/api/openAPIConfig';
import deepmerge from 'deepmerge';


const queueService = new QueueServiceApiFactory(configuration, '', instance);

const doNotConvertKeys = ['variables'];

const fieldsToSend = [
  'name',
  'type',
  'strategy',
  'team',
  'priority',
  'dncList',
  'schema',
  'payload',
  'taskProcessing',
  'maxOfRetry',
  'timeout',
  'secBetweenRetries',
  'variables',
  'calendar',
  'description',
  'enabled',
  'ringtone',
  'doSchema',
  'afterSchema',
  'stickyAgent',
  'grantee',
  'tags',
];

const preRequestHandler = (item) => {
  const copy = deepCopy(item);
  copy.variables = copy.variables.reduce((variables, variable) => {
    if (!variable.key) return variables;
    return {
      ...variables,
      [variable.key]: variable.value,
    };
  }, {});
  return copy;
};

const processing = (processing = {}) =>
  deepmerge(
    {
      enabled: false,
      formSchema: {},
      sec: 30,
      renewalSec: 15,
    },
    processing,
  );


const getQueuesList = async (params) => {
  const defaultObject = {
    type: 0,
    enabled: false,
    active: 0,
    waiting: 0,
    priority: '0',
  };

  const { page, size, search, sort, fields, id, queueType, team, tags } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
  ]);

  try {
    const response = await queueService.searchQueue(
      page,
      size,
      search,
      sort,
      fields,
      id,
      queueType,
      team,
      tags,
    );
    const { items, next } = applyTransform(response.data, [
      snakeToCamel(doNotConvertKeys),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, [mergeEach(defaultObject)]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getQueue = async ({ itemId: id }) => {
  const defaultObject = {
    tags: [],
    type: 0,
    formSchema: {},
    taskProcessing: {},
  };
  const responseHandler = (item) => {
    const copy = deepCopy(item);
    try {
      if (copy.variables) {
        copy.variables = Object.keys(copy.variables).map((key) => ({
          key,
          value: copy.variables[key],
        }));
      }
      if (isEmpty(copy.taskProcessing)) {
        copy.taskProcessing = processing({
          enabled: !!copy.processing,
          formSchema: copy.formSchema,
          sec: copy.processingSec || 0,
          renewalSec: copy.processingRenewalSec || 0,
        });
      }
      return copy;
    } catch (err) {
      throw err;
    }
  };
  try {
    const response = await queueService.readQueue(id);
    return applyTransform(response.data, [
      snakeToCamel(doNotConvertKeys),
      merge(defaultObject),
      responseHandler,
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};


const QueuesAPI = {
  getList: getQueuesList,
  get: getQueue,
};

export default QueuesAPI;
