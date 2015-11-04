(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name ngPasswordStrengthApp.directive:ngPasswordStrength
   * @description
   * Progress bar showing the strength of a given password
   */
  angular
    .module('ngPasswordStrength')
    .directive('ngPasswordStrength', ['PasswordStrengthService', function (PasswordStrengthService) {
    function link(scope /*, elem, attrs*/ ) {

      scope.value = scope.value || PasswordStrengthService.measureStrength(scope.pwd);
      scope.innerClassPrefix = scope.innerClassPrefix || '';
      scope.outterClassPrefix = scope.outterClassPrefix || '';

      var modes = {
        foundation: {
          innerClass: 'meter'
        },
        bootstrap: {
          innerClass: 'progress-bar',
          innerClassPrefix: 'progress-bar-'
        }
      };

      scope.$watch('mode', function() {

        if (scope.mode === 'bootstrap' || scope.mode === 'foundation') {
          //If bootstrap or foundation mode then apply the classes
          angular.extend(scope, modes[scope.mode]);
          return;
        }

        scope.valueClass = getClass(scope.value);
      });

      scope.$watch('pwd', function() {
        scope.value = PasswordStrengthService.measureStrength(scope.pwd);
        scope.valueClass = getClass(scope.value);
      });

      function getClass(s) {
        var outterClass = '';
        switch (Math.floor(s / 20)) {
          case 0: // Very weak
            outterClass = 'danger';
            break;
          case 1: // Weak
            outterClass = 'warning';
            break;
          case 2: // Good
            outterClass = 'info';
            break;
          default: // Strong or Very strong
            outterClass = 'success';
        }
        return {
          outter: scope.outterClassPrefix + 'alert',
          inner: scope.innerClassPrefix + outterClass
        };
      }
    }

    return {
      template: '<div class="progress {{valueClass.outter}}"><div class="{{valueClass.inner}} {{innerClass}}" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100" ng-style="{width : ( value + \'%\' ) }"><span class="sr-only">{{value}}%</span></div></div>',
      restrict: 'A',
      scope: {
        pwd: '=ngPasswordStrength',
        value: '=strength',
        innerClassPrefix: '@?',
        outterClassPrefix: '@?',
        innerClass: '@?',
        mode: '@?' //Mode is set via attribute
      },
      link: link
    };

  }]);



})();
