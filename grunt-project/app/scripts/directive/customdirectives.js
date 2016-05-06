var scroll_running_status = 0;
angular.module("customDirectives", [])
.directive('activeClass', function(){
	return{
		restrict : 'A',
		replace: false,
		link: function(scope , element, attrs){

			element.bind("click", function(e){

				console.log(element);
				var bginactive = element[0].attributes['bginactive'].value;
				var bgcolor = element[0].attributes['bgcolor'].value;


				var x =element.parent().children();

				for (var i = 0; i < x.length; i++) {
					x[i].style.backgroundColor = bginactive;
				}

				element.css('background-color', bgcolor);

			});
		}
	};
})
.directive('scrollLink', function($window) {
            return {
                scope: {
                    scrollTo: '@scrollTo',
                    offsetHeight: '@offsetHeight',
                    activeMenu: "="
                },
                restrict: 'A',
                replace: false,
                link: function(scope, elem, attrs) {

// scroll function starts here 
                    angular.element($window).bind("scroll", function() {
                        var all_block = document.getElementsByClassName('all_block');
                        //console.log(all_block);

                        for(var i = 0; i < all_block.length; i++){
                            var current_block_id = all_block[i].attributes['id'].value;
                            var currentMenu = document.querySelector('[activeMenu='+current_block_id+']');

                            var all_menu = document.getElementsByClassName("active_block");
                            
                            currentMenu.style.color = '#000';

                            if(pageYOffset > all_block[i].offsetTop-100){
                                for(var j = 0; j < all_menu.length; j++){
                                    all_menu[j].style.color = '#000';
                                }
                                currentMenu.style.color = "#FE0000";
                                //console.log(currentMenu);
                            }else if(pageYOffset < all_block[i].offsetTop-100){
                                currentMenu.style.color = '#000';
                            }else {
                                currentMenu.style.color = 'black';
                            }


                        }


                         
                    });
// scroll function ends here


                    elem.on('click', function(event) {
                        event.preventDefault();
                        if( scroll_running_status == 1 ) {
                            return false;
                        }
                        var scrollToObj = document.getElementsByClassName(scope.scrollTo)[0];
                        if(typeof scrollToObj != 'undefined'){
                            var mmyht = divHeight(scrollToObj) - parseInt(scope.offsetHeight);
                            if (window.pageYOffset < mmyht){
                                scrollDownAnimation(scrollToObj,scope.offsetHeight);
                            }else if (window.pageYOffset > mmyht){
                                scrollUpAnimation(scrollToObj,scope.offsetHeight);
                            }
                        }else{
                            return false;
                        }
                    });
                    var scrollDownAnimation = function(scrollToObj,htt) {
                        var myht = divHeight(scrollToObj) - parseInt(htt);
                        scroll_running_status = 1;
                        var moveBy = 500;
                        var winPageYOffset = Math.ceil(window.pageYOffset);
                        
                        if (winPageYOffset >= myht || ((window.innerHeight + winPageYOffset) >= document.body.offsetHeight) ) {     //if scrolled to reqd element or end of page reached
                            scroll_running_status = 0;
                            return false;
                        } else {
                            
                            if (150 < (myht - winPageYOffset) && (myht - winPageYOffset) <= 500) {
                                moveBy = 150;
                            }
                            if (50 < (myht - winPageYOffset) && (myht - winPageYOffset) <= 150) {
                                moveBy = 50;
                            }
                            if (0 < (myht - winPageYOffset) && (myht - winPageYOffset) <= 50) {
                                moveBy = (myht - winPageYOffset);
                            }
                            
                            window.scrollBy(0, moveBy);
                            setTimeout(function() {
                                scrollDownAnimation(scrollToObj,htt);
                            },50);
                        }
                    }
                    var scrollUpAnimation = function(scrollToObj,htt) {
                        var myht = divHeight(scrollToObj) - parseInt(htt);
                        scroll_running_status = 1;
                        var moveBy = -500;
                        if (window.pageYOffset <= myht ) {
                            scroll_running_status = 0;
                            return false;
                        } else {
                            
                            if (150 < (window.pageYOffset - myht) && (window.pageYOffset - myht) <= 500) {
                                moveBy = -150;
                            }
                            if (50 < (window.pageYOffset - myht) && (window.pageYOffset - myht) <= 150) {
                                moveBy = -50;
                            }
                            if (0 < (window.pageYOffset - myht) && (window.pageYOffset - myht) <= 50) {
                                moveBy = -(window.pageYOffset - myht);
                            }
                            
                            window.scrollBy(0, moveBy);
                            setTimeout(function() {
                                scrollUpAnimation(scrollToObj,htt);
                            }, 50);
                        }
                    }
                    var divHeight = function(ele) {
                        var x = 0;
                        while (ele) {
                            x += ele.offsetTop;
                            ele = ele.offsetParent;
                        }
                        return x;
                    }
                }
            };
        });