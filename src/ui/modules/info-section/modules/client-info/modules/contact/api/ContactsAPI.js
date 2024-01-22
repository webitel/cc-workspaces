import applyTransform, {
  merge,
  starToSearch,
  camelToSnake,
  snakeToCamel,

  notify,
  sanitize,
} from '@webitel/ui-sdk/src/api/transformers';
import {
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults';
import { ContactsApiFactory } from 'webitel-sdk';
import configuration from '../../../../../../../../app/api/openAPIConfig';
import instance from '../../../../../../../../app/api/instance';
import getDefaultGetListResponse from './getDefaultGetListResponse';

const service = new ContactsApiFactory(configuration, '', instance);

const getList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'qin'];

  params.fields = [
    'id',
    'etag',
    'name',
    'managers',
    'labels',
    'about',
    'variables',
    'timezones',
    'phones',
    'emails',
  ];

  const listResponseHandler = (items) => items.map((item) => ({
    ...item,
    managers: item.managers ? [...item.managers.data] : [],
    labels: item.labels ? [...item.labels.data] : [],
    variables: item.variables ? [...item.variables.data] : [],
    timezones: item.timezones ? [...item.timezones.data] : [],
    phones: item.phones ? [...item.phones.data] : [],
    emails: item.emails ? [...item.emails.data] : [],
  }));

  const transformations = [
    sanitize(fieldsToSend),
    merge(getDefaultGetParams()),
    camelToSnake(),
  ];
  //
  // This code needed for adding starToSearch method to applyTransform while searchKey !== SearchMode.VARIABLES because '*' in variables search mode brokes backend logic.
  if (params.qin !== 'variable') {
    transformations.push(starToSearch('q'));
  }

  const {
    page,
    size,
    q,
    sort,
    fields,
    id,
    qin,
  } = applyTransform(params, transformations);

  try {
    const response = await service.searchContacts(
      page,
      size,
      q,
      sort || '+name',
      fields,
      id,
      qin,
    );
    const { data } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return applyTransform(data, [
      snakeToCamel(),
      listResponseHandler,
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const get = async ({ contactId: id }) => {
  const fields = [
    'id',
    'name',
    'about',
    'labels',
    'mode',
    'managers',
    'timezones',
    'etag',
    'variables',
    'phones',
    'emails',
  ];
  const itemResponseHandler = (item) => {
    return {
      ...item,
      managers: item.managers ? [...item.managers.data] : [],
      labels: item.labels ? [...item.labels.data] : [],
      variables: item.variables ? [...item.variables.data] : [],
      timezones: item.timezones ? [...item.timezones.data] : [],
      phones: item.phones ? [...item.phones.data] : [],
      emails: item.emails ? [...item.emails.data] : [],
    };
  };

  try {
    const response = await service.locateContact(id, fields);
    return applyTransform(response.data, [
      snakeToCamel(),
      itemResponseHandler,
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const fieldsToSend = ['name', 'labels', 'about', 'managers', 'timezones', 'phones'];

const sanitizeManagers = (itemInstance) => {
  // handle many managers and even no managers field cases
  const managers = (itemInstance.managers ||
    []).filter(({ user } = {}) => user.id);
  return { ...itemInstance, managers };
};

const sanitizeTimezones = (itemInstance) => {
  // handle many timezones and even no timezones field cases
  const timezones = (itemInstance.timezones ||
    []).filter(({ timezone } = {}) => timezone.id);
  return { ...itemInstance, timezones };
};

const add = async ({ itemInstance }) => {
  const item = applyTransform(itemInstance, [
    sanitizeManagers,
    sanitizeTimezones,
    sanitize(fieldsToSend),
    camelToSnake(),

  ]);
  try {
    const response = await service.createContact(item);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

export default {
  getList,
  add,
  get,
};
