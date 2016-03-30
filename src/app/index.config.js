(function() {
  'use strict';

  angular
    .module('pldEvaluation')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
