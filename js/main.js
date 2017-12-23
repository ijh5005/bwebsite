'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'animate', 'data', 'task', 'navigate', function($scope, $rootScope, $interval, $timeout, animate, data, task, navigate){

  $scope.name = 'name';
  $scope.themeColor = '#ed7d7d';
  $scope.themeBorderColor = '#fce9e9';
  $scope.products = data.products;
  $scope.cartItems = data.cartItems;
  $scope.filters = data.filters;
  $scope.navOptions = data.navOptions;

  $scope.showOptions = (e) => {
    const id = parseInt(e.currentTarget.id);
    $rootScope.currentItem = id;
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
    const complete = () => {
      $('.options[id='+ id + ']').css('left', '100vw');
      $('.itemPreview[id='+ id + ']').show();
    }
    const animation = { top: '100%' };
    const options = { duration: 0, complete };
    $('.options .itemDesciption').animate(animation, options);
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
  $scope.navigatePage = (e) => {
    const pageClick = e.target.innerText.toLowerCase();
    if(pageClick != $rootScope.currentPage){
      $('.navOptions').css('color', '#000');
      animate.navigatePage(e, pageClick, $scope.themeColor);
    }
  }
  $scope.customMouseOver = () => {
    $('.imgHolder p').css('opacity', 1);
  }
  $scope.customMouseLeave = () => {
    $('.imgHolder p').css('opacity', 0);
  }

  $rootScope.bind = true;
  $rootScope.currentPage = "brands";
  $rootScope.viewSlideShow = [];
  $rootScope.currentSlideImg;
  $rootScope.currentSlideImgNumber = 0;
  $rootScope.cartQuantity = data.getCartLength();
  $rootScope.clickIt = true;
  $rootScope.trackItems = 0;
  $rootScope.dynamicClasses = 'borderRed';
  $rootScope.currentImgEvent;
  $rootScope.currentItem;

  task.init($scope.themeColor);
  animate.customButton();

}]);

app.service('animate', function($rootScope, $timeout, $interval, data, task){
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

      //if the shopping cart drop needs adjustments chang the dx and dy
      const dx = 94;
      const dy = 120;

      const left = cartPostion.left + dx;
      const top = cartPostion.top + dy;

      const inBag = top + 20;

      const selfPosition = $selector.position();

      $clone.css('position', 'absolute')
            .css('top', selfPosition.top)
            .css('left', selfPosition.left)
            .css('height', '27.4em')
            .addClass('fullBackground')
            .css('backgroundImage', 'url(' + data.products[nodeValue].img + ')');

      const animation = { left: left, top: top, height: height, width: width }
      const animation2 = { top: inBag, opacity: 0 }
      const complete = () => {
        $clone.css('zIndex', -1);
        $clone.animate(animation2)

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
      const options = { duration: 1000, complete }
      $clone.animate(animation, options);
    }, 50);
  }
  this.customButton = () => {
    let count = 0;
    let position = '-4em';
    const pointCustom = $interval(() => {
      if(count === 20){
        $interval.cancel(pointCustom);
        $('.point').fadeOut();
      } else {
        $('.point').css('top', position);
        if(position === '-4em'){ position = '-3em'; }
        else { position = '-4em'; }
        count++;
      }
    }, 500);
    // $timeout(() => {
    //   const animation = { top: '10%', left: '90%', height: '2em' };
    //   const complete = () => {
    //     $('.pageBody').animate({ opacity: 1 });
    //     $('.imgHolder').css('width', '12em');
    //   };
    //   const options = { duration: 1000, complete }
    //   $(".imgHolder").animate(animation, options);
    // }, 1000)
  }
  this.navigatePage = (e, pageClick, themeColor) => {
    if(!$rootScope.navigating){
      $rootScope.navigating = true;
      $('.navSlider').addClass('transitionLeft').css('left', '0%');
      $timeout(() => {
        $rootScope.currentPage = pageClick;
        if($rootScope.currentPage === 'brands'){ task.populateImgsOnPage(); }

        const data = parseInt(e.target.attributes["0"].nodeValue);
        const thisNav = $('.navOptions[data=' + data + ']');
        $('.navOptions').css('color', '#000');
        thisNav.css('color', themeColor);

        $('.navSlider').css('left', '-100%');
        $timeout(() => {
          $rootScope.navigating = false;
          $('.navSlider').removeClass('transitionLeft').css('left', '100%');
        }, 800);
      }, 800);
    }
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
  this.init = (themeColor) => {
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

    $timeout(() => { $('.navOptions[data=1]').css('color', themeColor) });
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

app.service('navigate', function($rootScope, $timeout, data, animate, task){
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
    $rootScope.currentItem = $rootScope.nodeValue;
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
