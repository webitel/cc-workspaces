import { config } from '@vue/test-utils';
import en from '../../src/locale/en/en';

config.mocks.$t = (msg) => en[msg] || msg;
config.mocks.$tc = (msg) => en[msg] || msg;
