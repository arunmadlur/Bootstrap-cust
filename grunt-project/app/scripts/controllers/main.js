'use strict';

/**
 * @ngdoc function
 * @name angularProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularProjectApp
 */
angular.module('gruntProjectApp')
  .controller('MainCtrl', function ($scope) {
   	$scope.title = "welcome arun";
   	$('.dropdown-toggle').dropdown();
   	$('[data-toggle="tooltip"]').tooltip();
   	$("#popoverDemo").popover({trigger: 'click'});
  });
