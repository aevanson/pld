(function() {
  'use strict';

  angular
    .module('pldEvaluation')
    .controller('MainController', MainController)
    .animation('.tab-pane', panelAnimation);

  /** @ngInject */
  function MainController($log, $timeout, $scope, TweenMax, moment, $http) {
    var vm = this;

    //Load a JSON file via service in components/getJson
    $http.get('assets/json/sample.json').then(function(result){
      vm.chartWidgets = result.data.chartWidgets;
      vm.stockWidget = result.data.stockWidget;

      //Post-load init for items dependant on widget data
      vm.date = moment(vm.stockWidget.timeStamp).calendar();
      vm.activeChart = 0;
    });

    // Local-scope functions for front-end
    vm.percentOfArray = percentOfArray;
    vm.percentChanged = percentChanged;
    vm.abs = Math.abs;

    //Line Chart options (Chartist)
    vm.lineOptions = {
      showPoint: false,
      fullWidth: true,
      chartPadding: {
        right: 0,
        left:-40
      },
      lineSmooth:false,
      axisX: {
        showLabel: false,
        showGrid: false
      },
      axisY: {
        showLabel: false,
        showGrid: false
      },
      low:0
    };

    //Bar Chart Options (chartist)
    vm.barOptions = {
      fullWidth:true,
      axisX: {
        showLabel: false,
        showGrid: false
      },
      axisY: {
        showLabel: false,
        showGrid: false
      },
      chartPadding: {
        right: 0,
        left:-40
      }
    };

    // Donut Chart options (Chartist)
    vm.donutOptions = {
      donut: true,
      showLabel: false
    };

    //Chartist Events
    vm.events = {
      //Use 'draw' event to attach mouse event listeners to the svg paths
      draw: function(obj) {
        obj.group._node.addEventListener('mouseenter', function(e){
          TweenMax.to(e.target.firstChild, 0.15, {strokeWidth:70});
        });
        obj.group._node.addEventListener('mouseleave', function(e){
          TweenMax.to(e.target.firstChild, 0.15, {strokeWidth:60});
        });
      }
    };

    //AngularStrap Tabs
    $scope.tabs = [
      {
        title: 'Diagram Stats',
        content: 'app/main/pie-chart.html'
      },
      {
        title: 'Month Report',
        content: 'app/main/pie-chart-2.html'
      }
    ];
    $scope.tabs.activeTab = 0;

    //Watcher for active tab -- primarily used to update hidden charts when they come into view
    $scope.$watch('tabs.activeTab', function(current, previous){
      if(current === previous){
        //Load the panes into a var for targeted DOM updates
        vm.el = document.querySelector('.pie-charts .tab-content');
      }else{
        vm.activeChart = $scope.tabs.activeTab;
        // Chartist update() needs to be called once because the charts on panes with display:none
        // have been positioned based on height/width 0 of parent container
        $timeout(function(){

          vm.el.children[current].querySelector('chartist').__chartist__.update();
        }, 10);

      }
    });

    //Helper functions
    function sumArray(srcArray){
      return srcArray.reduce(function(previous, current) {
        return previous + current;
      });
    }

    function percentOfArray(value, array){
      return value/sumArray(array)*100;
    }

    function percentChanged(newValue, oldValue){
      var change = Math.abs(newValue-oldValue);

      return change/oldValue*100;
    }

  }

  //Animation for pieCharts -- uses ngAnimate and GSAP JS animation
  function panelAnimation($log, TweenMax) {

    return {
      addClass: function(element, className, done) {
        var xAmt = 50;
        if (className !== 'active') {
          done();
          return;
        }
        if(element.attr('data-item-index') === '0'){
          xAmt = -50;
        }
        TweenMax.set(element[0].querySelector('.panel-body'), { autoAlpha: 0, scale: 1, x:xAmt });
        TweenMax.to(element[0].querySelector('.panel-body'), 0.5, { x: 0, autoAlpha: 1, onComplete: done });
      },
      removeClass: function(element, className, done) {

        if (className !== 'active') {
          done();
          return;
        }
      }
    };
  }
})();
