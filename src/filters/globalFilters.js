import Vue from 'vue';
import { truncate, truncateFromEnd } from './truncate/truncate';

Vue.filter('truncate', truncate);
Vue.filter('truncateFromEnd', truncateFromEnd);
