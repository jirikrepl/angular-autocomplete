'use strict';

angular.module('myApp.view', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view/view.html'
  });
}])

.controller('urlCtrl', function ($scope) {
  $scope.url = 'http://suggestqueries.google.com/complete/search?client=firefox&q=';
})

.controller('trieCtrl', ['$scope', 'states', function ($scope, states) {
  $scope.states = states;
}])
