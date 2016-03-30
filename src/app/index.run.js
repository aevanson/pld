(function() {
  'use strict';

  angular
    .module('pldEvaluation')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
