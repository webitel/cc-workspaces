import { config } from '@vue/test-utils';
import en from '../../src/app/locale/en/en';

config.mocks.$t = (msg) => en[msg] || msg;
config.mocks.$tc = (msg) => en[msg] || msg;
