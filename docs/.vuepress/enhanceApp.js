import 'core-js/stable'
import 'regenerator-runtime/runtime'

export default ({
    Vue, // the version of Vue being used in the VuePress app
    options, // the options for the root Vue instance
    router, // the router instance for the app
    siteData // site metadata
  }) => {
    const RichText = require('../../src/index.js');
    Vue.component('RichText', RichText.default);
  };
