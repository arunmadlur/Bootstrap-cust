'use strict';

/**
 * @ngdoc overview
 * @name angularProjectApp
 * @description
 * # angularProjectApp
 *
 * Main module of the application.
 */
angular
  .module('gruntProjectApp', [
    'ngAnimate',
    'ngCookies',
    'ngRoute',
    'ui.bootstrap',
    'duScroll',
    'customDirectives'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        navClass: 'navClass'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
         navClass: ''
      })
      .when('/:title', {
        templateUrl: 'views/contentDetail.html',
        controller: 'ContentDetailCtrl',
        navClass: 'navClass'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope){
    $rootScope.$on('$routeChangeSuccess',function(event, toState, toParams, fromState, fromParams){
        $rootScope.navClass = toState.navClass;
    });

  })
  .filter('rawHtml', ['$sce', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}]);
