'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', 'animate', function($scope, animate){
  $scope.name = 'name';
  $scope.moveToCart = (e) => {
    const nodeValue = e.currentTarget.attributes[0].nodeValue;
    const selector = '.itemImage[data=' + nodeValue + ']';
    animate.itemToShoppingCart(selector, nodeValue);
  }
}]);

app.service('animate', function(){
  this.itemToShoppingCart = (selector, nodeValue) => {
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
    console.log(selfPosition);

    $clone.css('position', 'absolute')
             .css('top', selfPosition.top)
             .css('left', selfPosition.left)
             .css('height', '27.4em');

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
      }
    });
  }
});
