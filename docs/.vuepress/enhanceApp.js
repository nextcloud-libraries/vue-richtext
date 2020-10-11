import 'core-js/stable'
import 'regenerator-runtime/runtime'

import RichText from '../../src/RichText';

export default ({ Vue }) => {
    Vue.component('RichText', RichText);
  };
