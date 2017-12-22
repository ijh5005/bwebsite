'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'animate', 'data', 'task', 'navigate', function($scope, $rootScope, $interval, $timeout, animate, data, task, navigate){
  $scope.name = 'name';
  $scope.products = data.products;
  $scope.cartItems = data.cartItems;
  $scope.filters = data.filters;
  $scope.navOptions = data.navOptions;
  $scope.showOptions = (e) => {
    const id = parseInt(e.currentTarget.id);
    $('.itemPreview[id='+ id + ']').hide();
    $('.options[id='+ id + ']').css('left', 0);
    $('.options .itemDesciption').animate({ top: '60%' }, 100);
  }
  $scope.checkboxClick = (e, index) => {
    const attributes = e.currentTarget.attributes;
    const values = [];
    for(let i = 0; i < attributes.length; i++){ values.push(attributes[i].nodeName) }
    const isSizeCheckbox = values.includes('data-size');
    const isCategoryCheckbox = values.includes('data-category');
    const isChecked = attributes[1].nodeValue.includes('checkBoxChecked');
    if(isSizeCheckbox){
      if(isChecked){ $('.checkBox[data-size = ' + index + ']').removeClass('checkBoxChecked') }
      else{ $('.checkBox[data-size = ' + index + ']').addClass('checkBoxChecked') }
    }
    else if (isCategoryCheckbox) {
      if(isChecked){ $('.checkBox[data-category = ' + index + ']').removeClass('checkBoxChecked') }
      else{ $('.checkBox[data-category = ' + index + ']').addClass('checkBoxChecked') }
    }
  }
  $scope.colorClick = (e, index) => {
    const attributes = e.currentTarget.attributes;
    const $target = $('.colorCircle[data-color = ' + index + ']');
    const isChecked = $target.hasClass('colorCircleSelected');
    if(isChecked){ $target.removeClass('colorCircleSelected') }
    else{ $target.addClass('colorCircleSelected') }
  }
  $scope.hideOptions = (e) => {
    const id = parseInt(e.currentTarget.id);
    $('.options .itemDesciption').animate({ top: '100%' }, {
                                            duration: 5,
                                            complete: () => {
                                              $('.options[id='+ id + ']').css('left', '100vw');
                                              $('.itemPreview[id='+ id + ']').show();
                                            }
    });
  }
  $scope.moveToCart = (e, index) => {
    $rootScope.trackItems++;
    $rootScope.clickIt = false;
    const nodeValue = e.currentTarget.attributes[0].nodeValue;
    const selector = '.itemImage[data=' + nodeValue + ']';
    animate.itemToShoppingCart(selector, nodeValue, index);
  }
  $scope.currentGalleryImg = (e, index) => {
    $rootScope.nodeValue = e.currentTarget.attributes[0].nodeValue;
    $rootScope.currentIndex = index;
    $rootScope.currentImgEvent = e;
    navigate.currentGalleryImg(true);
  }
  $scope.removeFromCart = (index) => {
    $scope.cartItems.splice(index, 1);
    $rootScope.trackItems--;
  }
  $scope.hideBigView = () => {
    $('.shoppingCartBigView').hide();
  }
  $scope.galleryLeftClick = () => {
    navigate.galleryLeftClick();
  }
  $scope.galleryRightClick = () => {
    navigate.galleryRightClick();
  }
  $rootScope.bind = true
  $rootScope.viewSlideShow = [];
  $rootScope.currentSlideImg;
  $rootScope.currentSlideImgNumber = 0;
  $rootScope.cartQuantity = data.getCartLength();
  $rootScope.clickIt = true;
  $rootScope.trackItems = 0;
  $rootScope.dynamicClasses = 'borderRed';
  $rootScope.currentImgEvent;
  task.init();

  const popUp = () => {
    $timeout(() => {
      // $(".customPopUpGuide").removeClass('center');
      $(".customPopUpGuide").animate({
        top: 0,
        left: 0
      });
      $timeout(() => {
        $(".popUpPage").css('backgroundColor', 'transparent');
        $timeout(() => {
          $(".popUpPage").css('z-index', '-1');
        }, 1000)
      }, 1000)
    }, 1000)
  }
  popUp();
}]);

app.service('animate', function($rootScope, $timeout, data){
  //animate the item to the shopping cart
  this.itemToShoppingCart = (selector, nodeValue, index) => {
    $('.shoppingCartBigView').hide();
    $('.options').css('left', '100vw');
    $timeout(() => {
      $('.itemPreview').show();
      $('body').append('<div data=\'' + nodeValue + 'clone\' class="itemImage" ng-click=\'moveToCart($event)\'></div>')
      const $selector = $(selector);
      const $clone = $('.itemImage[data=' + nodeValue + 'clone]');
      //find target position
      const cartPostion = $('.cartItemHeading img').position();

      const height = '1.6em';
      const width = '1.2em';
      const top = cartPostion.top + 50;
      const inBag = top + 20;
      const left = cartPostion.left + 8;

      const selfPosition = $selector.position();

      $clone.css('position', 'absolute')
               .css('top', selfPosition.top)
               .css('left', selfPosition.left)
               .css('height', '27.4em')
               .addClass('fullBackground')
               .css('backgroundImage', 'url(' + data.products[nodeValue].img + ')');

      $clone.animate({
        left: left,
        top: top,
        height: height,
        width: width
      }, {
        duration: 1000,
        complete: () => {
          $clone.css('zIndex', -1);
          $clone.animate({
            top: inBag,
            opacity: 0
          })

          const selectedItem = data.products[index];

          //timeout updates the DOM
          $timeout(() => {
            $rootScope.clickIt = true;
            $rootScope.clickable = null;
            if($rootScope.trackItems > data.cartItems.length){
              data.cartItems.splice(0, 0, selectedItem);
            }
          }, 10);
        }
      });
    }, 50);
  }
});

app.service('data', function($rootScope, $interval){
  this.navOptions = ['HOME', 'BRANDS', 'DESIGNERS', 'CONTACT'],
  this.cartItems = [],
  this.products = products;           // this comes from database.js
  this.getCartLength = () => {
    $interval(() => {
      $rootScope.cartQuantity = this.cartItems.length;
    })
  }
  this.filters = {
    categories: ['NEW ARRIVALS', 'SHOES', 'PURSES', 'BLANKETS'],
    colors: [
      { name: 'Light Red', hex: '#ed7d7d' },
      { name: 'Light Red', hex: '#ed7d7d' },
      { name: 'Light Red', hex: '#ed7d7d' },
      { name: 'Light Red', hex: '#ed7d7d' },
    ],
    sizes: ['XS', 'S', 'M', 'L']
  }
});

app.service('task', function($rootScope, $interval, $timeout, data){
  this.init = () => {
    $('.shoppingCartBigView').hide();
    this.populateImgsOnPage();
    let opacity = true;
    $interval(() => {
      if(opacity){
        $('.customizeItems').css('opacity', '0.4');
        opacity = !opacity;
      } else {
        $('.customizeItems').css('opacity', '1');
        opacity = !opacity;
      }
    }, 1000);
  }
  this.populateImgsOnPage = () => {
    const imgLength = data.products.length;
    let index = 0;
    const imgFill = $interval(() => {
      if(index === imgLength){
        $interval.cancel(imgFill);
      } else {
        $('.itemImg[data=' + index + ']').css('opacity', 1).hide().fadeIn().css('left', 0);
        index++
      }
    }, 200);
  }
});

app.service('navigate', function($rootScope, $timeout, data, animate){
  this.galleryLeftClick = () => {
    $rootScope.currentSlideImgNumber--;
    if($rootScope.currentSlideImgNumber < 0){
      $rootScope.currentSlideImgNumber = $rootScope.viewSlideShow.length - 1;
    }
    this.currentGalleryImg(false);
  }
  this.galleryRightClick = () => {
    $rootScope.currentSlideImgNumber++;
    if($rootScope.currentSlideImgNumber === $rootScope.viewSlideShow.length){
      $rootScope.currentSlideImgNumber = 0;
    }
    this.currentGalleryImg(false);
  }
  //controls the view of the gallery picture
  this.currentGalleryImg = (isFromPage) => {
    if(isFromPage){ $rootScope.currentSlideImgNumber = 0 }
    $rootScope.viewSlideShow = products[$rootScope.nodeValue].imgSlideShow;
    $rootScope.currentSlideImg = $rootScope.viewSlideShow[$rootScope.currentSlideImgNumber];
    $('.shoppingCartBigView').show();
  }
});

app.directive("tocart", function($rootScope) {
  return {
    template: '<div data={{$index}} disableclick class="addToCartBtn flexRow pointer" ng-click="moveToCart($event, $index)"><p data={{$index}} disableclick class="addToChartText" ng-click="moveToCart($event, $index)">ADD TO CART</p></div>'
  }
});

app.directive("view", function($rootScope) {
  return {
    template: '<div data={{$index}} disableclick class="viewBtn flexRow pointer" ng-click="currentGalleryImg($event, $index)"><p data={{$index}} disableclick class="addToChartText" ng-click="currentGalleryImg($event, $index)">VIEW GALLERY</p></div>'
  }
});
