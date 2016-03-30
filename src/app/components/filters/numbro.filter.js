(function() {
  'use strict';

  angular
    .module('pldEvaluation')
    .filter('numbroFilter', numbroFilter);

  /** @ngInject */

  /**
  * Basic number filter that formats numbers using the Numbro.js library
  * http://numbrojs.com/format.html
  */
  function numbroFilter(numbro) {
    return function(input, option) {

      return numbro(input).format(option);

    };
  }
})();
