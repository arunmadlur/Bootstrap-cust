'use strict';

/**
 * @ngdoc function
 * @name angularProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularProjectApp
 */
angular.module('gruntProjectApp')
  .controller('ContentDetailCtrl', function ($scope,$http, $document) {
  		
   		$http.get('data.json')
		.then(function(response){
			$scope.contents = response.data.data;
			console.log($scope.contents);
		});

		$document.on('scroll', function(e) {
      		// console.log('Document scrolled to ', $document.scrollLeft(), $document.scrollTop());
    		
    		var li = document.getElementsByClassName('active')[0];
    		var a= document.getElementsByClassName('affix')[0];
			if (li) {
				li.scrollIntoView();
			}
    	});
		
		    // $scope.toSection3 = function() {
		    //   $document.scrollToElementAnimated(section3);
		    // }
		  

  }).value('duScrollOffset', 30);
