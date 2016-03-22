'use strict';


angular.module('gruntProjectApp')
.controller('HomeCtrl',function($scope,$http){
	$http.get('http://localhost/Bootstrap-cust/grunt-project/app/data.json')
	.then(function(response){
		$scope.contents = response.data.data;
		console.log($scope.contents);
	});
	$http.get('http://localhost/Bootstrap-cust/grunt-project/app/category.json')
	.then(function(response){
		$scope.categories = response.data.data;
		console.log($scope.category);
		$scope.mycategory = $scope.categories[0];
	});

})
.factory('$swipe', [function() {
  // The total distance in any direction before we make the call on swipe vs. scroll.
  var MOVE_BUFFER_RADIUS = 10;

  function getCoordinates(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var e = (event.changedTouches && event.changedTouches[0]) ||
        (event.originalEvent && event.originalEvent.changedTouches &&
            event.originalEvent.changedTouches[0]) ||
        touches[0].originalEvent || touches[0];

    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  return {
    bind: function(element, eventHandlers) {
      // Absolute total movement, used to control swipe vs. scroll.
      var totalX, totalY;
      // Coordinates of the start position.
      var startCoords;
      // Last event's position.
      var lastPos;
      // Whether a swipe is active.
      var active = false;

      element.on('touchstart mousedown', function(event) {
        startCoords = getCoordinates(event);
        active = true;
        totalX = 0;
        totalY = 0;
        lastPos = startCoords;
        eventHandlers['start'] && eventHandlers['start'](startCoords, event);
      });

      element.on('touchcancel', function(event) {
        active = false;
        eventHandlers['cancel'] && eventHandlers['cancel'](event);
      });

      element.on('touchmove mousemove', function(event) {
        if (!active) return;

        // Android will send a touchcancel if it thinks we're starting to scroll.
        // So when the total distance (+ or - or both) exceeds 10px in either direction,
        // we either:
        // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
        // - On totalY > totalX, we let the browser handle it as a scroll.

        if (!startCoords) return;
        var coords = getCoordinates(event);

        totalX += Math.abs(coords.x - lastPos.x);
        totalY += Math.abs(coords.y - lastPos.y);

        lastPos = coords;

        if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
          return;
        }

        // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
        if (totalY > totalX) {
          // Allow native scrolling to take over.
          active = false;
          eventHandlers['cancel'] && eventHandlers['cancel'](event);
          return;
        } else {
          // Prevent the browser from scrolling.
          event.preventDefault();
          eventHandlers['move'] && eventHandlers['move'](coords, event);
        }
      });

      element.on('touchend mouseup', function(event) {
        if (!active) return;
        active = false;
        eventHandlers['end'] && eventHandlers['end'](getCoordinates(event), event);
      });
    }
  };
}])
.service("HelperService", function($swipe) { 
    var hfElem,
    commonStore = {};
    
    this.$ = function(elem) {
        hfElem = elem;
        return this;
    };
    
    this.closest = function(fn) {
        while (hfElem) {
            if ( fn.call(hfElem) ) {
                return this;
            }
            hfElem = hfElem.parentNode;
        }
        return false;
    };
    
    this.elem = function() {
        return hfElem;
    };
    
    this.hasClass = function(pClass) {
         return ( (" " + hfElem.className + " " ).indexOf( " "+pClass+" " ) > -1 );
    };
    
    this.onHybridClick = function(pCallback) {
        var elemClicked = false;
        angular.element(hfElem).on('touchstart', function() {
            elemClicked = true;
        });
        angular.element(hfElem).on('touchmove', function() {
            elemClicked = false;
        });
        angular.element(hfElem).on('click touchend', function(event) {
            if (event.type === "click") {
                elemClicked = true;
            }
            
            if (elemClicked){
                pCallback.call(hfElem, event);
            }
        });
    };
    
    var onSwipe = function(pDirection, pCallback) {
        var MAX_VERTICAL_DISTANCE = 75;
        var MAX_VERTICAL_RATIO = 0.3;       // Vertical distance should not be more than a fraction of the horizontal distance.
        var MIN_HORIZONTAL_DISTANCE = 30;
        var startCoords, valid;
        
        var validSwipe = function(coords) {
            if (!startCoords) return false;
            var deltaY = Math.abs(coords.y - startCoords.y);
            var deltaX = (coords.x - startCoords.x) * pDirection;           //Multiplying by direction makes detlaX always positive
            
            return valid &&                                                 //Check that swipe event is valid/not cancelled
                deltaY < MAX_VERTICAL_DISTANCE &&                           //Should not cross vertical threshold, otherwise it becomes a scroll
                deltaX > 0 &&                                               //deltaX should always be positive(because it is being multiplied by direction)
                deltaX > MIN_HORIZONTAL_DISTANCE &&                         //Swipe should be longer than x-coordinate threshold
                deltaY / deltaX < MAX_VERTICAL_RATIO;
        };
      
        $swipe.bind(angular.element(hfElem), {
            'start': function(coords) {
                startCoords = coords;
                valid = true;
            },
            'cancel': function() {
                valid = false;
            },
            'end': function(coords, event) {
                if (validSwipe(coords)) {
                    pCallback.call(hfElem, event);
                }
            }
        });
    };
    
    this.onSwipeLeft = function(pCallback) {
        onSwipe(-1, pCallback);              //negative X-coordinate direction for swipe left
    };
    
    this.onSwipeRight = function(pCallback) {
        onSwipe(1, pCallback);              //positive X-coordinate direction for swipe right
    };
    
    this.dataStorage = function(pKey, pVal) {
        if( typeof pKey !== 'undefined' && typeof pVal !== 'undefined' ) {
            commonStore[pKey] = pVal;
        } else {
            return commonStore;
        }
    };
})
.directive('dirSlCarousel',function(HelperService,$rootScope,$timeout,$window){
            return {
                link: function(scope, element, attrs){
                	$timeout(function(){
              

                     var carouselScreen, carouselList, carouselItems, carouselItemWidth, carouselItemsLength, carouselItemsVisible, 
                             carouselItemsLength, carouselPrevBtn, carouselNxtBtn, maxSlides, currentSlide,hf = HelperService,isSliding;
                                        
                    var initCarousel = function(){
                        carouselScreen = element[0].getElementsByClassName('c_screen')[0];
                        carouselList = element[0].getElementsByClassName('c_list')[0];
                        carouselPrevBtn = element[0].getElementsByClassName('c_prev')[0];
                        carouselNxtBtn = element[0].getElementsByClassName('c_next')[0];
                        carouselItems = angular.element(carouselList).children();
                        carouselItemWidth = carouselItems[0].offsetWidth;
                        carouselItemsLength = carouselItems.length;
                        carouselItemsVisible = calculateBlocksToMove(carouselScreen,carouselItems,carouselItemsLength);
                        maxSlides = (carouselItemsLength%carouselItemsVisible)==0?(carouselItemsLength/carouselItemsVisible):(parseInt(carouselItemsLength/carouselItemsVisible)+1);
                        currentSlide = 0;
                        carouselList.style.position = "relative";
                        addTransitionStyle(carouselList,"0.3s");
                        addTransformStyle(carouselList,0);
                        carouselList.style.width = (carouselItemsLength*carouselItemWidth)+"px";
                        isSliding=0;
                        angular.element(carouselPrevBtn).on('click',function(){
                            slideRight();
                        });
                        angular.element(carouselNxtBtn).on('click',function(){
                            slideLeft();
                        });
                        hf.$(carouselScreen).onSwipeLeft(function() {
                            slideLeft();
                        });
                        hf.$(carouselScreen).onSwipeRight(function() {
                            slideRight();
                        });
                        getCurrentTransformVal();
                        addEmptyLis(carouselList);
                    }
                    
                    var addEmptyLis = function(carouselList){
                        carouselItems = angular.element(carouselList).children();
                        carouselItemsLength = carouselItems.length;
                        carouselItemsVisible = calculateBlocksToMove(carouselScreen,carouselItems,carouselItemsLength);
                        var aa = carouselItemsLength%carouselItemsVisible;
                        if(aa != 0){
                            var bb = carouselItemsVisible-aa;
                            var liList = [];
                            for(var i=0;i<bb;i++){
                                var li = document.createElement("li");
                                li.style.border = "none";
                                li.style.float = "left";
                                li.style.width = carouselItemWidth+"px";
                                li.className = "c_list_item c_index_"+(carouselItemsLength+i+1)+" empty_li";
                                liList[i] = li;
                            }
                            for(var i=0;i<bb;i++){
                                carouselList.appendChild(liList[i]);
                            }
                        }
                    }
                    
                    var removeEmptyLis = function(carouselList){
                        var carouselItemsAll = angular.element(carouselList).children();
                        for(var i=0;i<carouselItemsAll.length;i++){
                            var carouselItemObj = carouselItemsAll[i];
                            if(carouselItemObj.className.indexOf("empty_li")!=-1){
                                carouselList.removeChild(carouselItemsAll[i]);
                            }
                        }
                    }
                    var calculateBlocksToMove = function(carouselScreen,carouselItems,carouselItemsLength){
                        var citemstomove = 0;
                        for(var i=0;i<carouselItemsLength;i++){
                            if(carouselItems[i].offsetWidth > 0){
                                citemstomove = Math.round(carouselScreen.offsetWidth/carouselItems[i].offsetWidth);
                                break;
                            }
                        }
                        return citemstomove;
                    }
                    var addTransitionStyle = function(carouselList,transformVal){
                        carouselList.style.transition = "0.3s";
                        carouselList.style.setProperty("-webkit-transition", transformVal);
                        carouselList.style.setProperty("-moz-transition", transformVal);
                        carouselList.style.setProperty("-ms-transition", transformVal);
                        carouselList.style.setProperty("-o-transition", transformVal);
                    }
                    var addTransformStyle = function(carouselList,presentTransformVal){
                        carouselList.style.transform = "translate3d("+presentTransformVal+"px, 0px, 0px)";
                        carouselList.style.setProperty("-webkit-transform", "translate3d("+presentTransformVal+"px, 0px, 0px)");
                        carouselList.style.setProperty("-moz-transform", "translate3d("+presentTransformVal+"px, 0px, 0px)");
                        carouselList.style.setProperty("-ms-transform", "translate3d("+presentTransformVal+"px, 0px, 0px)");
                        carouselList.style.setProperty("-o-transform", "translate3d("+presentTransformVal+"px, 0px, 0px)");
                    }
                    var slideLeft = function(){
                        if(isSliding == 0){
                            isSliding = 1;
                            carouselItems = angular.element(carouselList).children();
                            carouselItemWidth = carouselItems[0].offsetWidth;
                            carouselItemsLength = carouselItems.length;
                            var presentTransformVal = getCurrentTransformVal();
                            if(currentSlide < maxSlides-1){
                                presentTransformVal = presentTransformVal-(carouselItemsVisible*carouselItemWidth);
                                addTransitionStyle(carouselList,"0.3s");
                                addTransformStyle(carouselList,presentTransformVal);
                                currentSlide++;
                                isSliding=0;
                            }else{
                                currentSlide=0;
                                var copiedObjs = [];
                                var clonedObjs = [];
                                for(var i=0;i<carouselItemsLength;i++){
                                    copiedObjs[i] = carouselList.children[i];
                                    clonedObjs[i] = copiedObjs[i].cloneNode(true); 
                                }
                                //append elements to the end of the list
                                for(var i=0;i<carouselItemsLength;i++){
                                    carouselList.appendChild(clonedObjs[i]); 
                                }
                                presentTransformVal = presentTransformVal-(carouselItemsVisible*carouselItemWidth);
                                addTransitionStyle(carouselList,"0.3");
                                addTransformStyle(carouselList,presentTransformVal);
                                $timeout(function(){
                                    for(var i=0;i<carouselItemsLength;i++){
                                        carouselList.removeChild(copiedObjs[i]);
                                    }
                                    addTransitionStyle(carouselList,"");
                                    addTransformStyle(carouselList,0);
                                    currentSlide = 0;
                                    isSliding=0;
                                },300);
                            } 
                        }
                    }
                    
                    var slideRight = function(){
                        if(isSliding == 0){
                            isSliding = 1;
                            carouselItems = angular.element(carouselList).children();
                            carouselItemWidth = carouselItems[0].offsetWidth;
                            carouselItemsLength = carouselItems.length;
                            var presentTransformVal = getCurrentTransformVal();
                            if(currentSlide == 0){
                                var copiedObjs = [], clonedObjs = [];
                                for(var i=0;i<carouselItemsLength;i++){
                                    copiedObjs[i] = carouselList.children[carouselItemsLength - (i + 1)];
                                    clonedObjs[i] = copiedObjs[i].cloneNode(true); 
                                }
                                addTransitionStyle(carouselList,"");
                                //append elements to the end of the list
                                for(var i=0;i<clonedObjs.length;i++){
                                    carouselList.insertBefore(clonedObjs[i], carouselList.firstChild);
                                }
                                presentTransformVal = getCurrentTransformVal()-(carouselItemWidth*(carouselItemsLength));
                                addTransformStyle(carouselList,presentTransformVal);
                                setTimeout(function(){
                                    presentTransformVal = getCurrentTransformVal()+(carouselItemWidth*carouselItemsVisible);
                                    addTransitionStyle(carouselList,"0.3s");
                                    addTransformStyle(carouselList,presentTransformVal);
                                    for(var i=0;i<carouselItemsLength;i++){
                                        carouselList.removeChild(copiedObjs[i]);
                                    }
                                    currentSlide = maxSlides-1;
                                    isSliding=0;
                                },200);
                                
                            }else{
                                if(currentSlide <= maxSlides){
                                    presentTransformVal = presentTransformVal+(carouselItemsVisible*carouselItemWidth);
                                    addTransitionStyle(carouselList,"0.3s");
                                    addTransformStyle(carouselList,presentTransformVal);
                                    currentSlide--;
                                    isSliding=0;
                                }
                            }
                        }
                    }
                    
                    var getCurrentTransformVal = function(){
                        var transformStr = carouselList.style.transform;
                        var modifiedTransformStr = transformStr.substring(transformStr.indexOf("3d(")+3,transformStr.indexOf(",",transformStr.indexOf("3d(")));
                        modifiedTransformStr = modifiedTransformStr.replace("px","");
                        modifiedTransformStr = parseInt(modifiedTransformStr);
                        return modifiedTransformStr;
                    }
                    initCarousel();
                    
                    $rootScope.$on('orientationChanged', function(isOrientationChanged){
                        if(isOrientationChanged){
                            isSliding=1;
                            $timeout(function(){
                                removeEmptyLis(carouselList);
                                addEmptyLis(carouselList);
                                addTransitionStyle(carouselList,"");
                                addTransformStyle(carouselList,0);
                                carouselItems = angular.element(carouselList).children();
                                carouselItemsLength = carouselItems.length;
                                carouselItemsVisible = calculateBlocksToMove(carouselScreen,carouselItems,carouselItemsLength);
                                maxSlides = (carouselItemsLength%carouselItemsVisible)==0?(carouselItemsLength/carouselItemsVisible):(parseInt(carouselItemsLength/carouselItemsVisible)+1);
                                currentSlide = 0;
                                isSliding=0;
                            },300);
                        }
                    });
                           },300);    
                    
                }
            }
        })