'use strict';

angular.module('myApp.autocomplete.autocomplete-directive', [])
.directive('autocomplete', ['$http', '$compile', 'queryService', function ($http, $compile, queryService) {
  return {
    restrict: 'E',
    link: function (scope, element, attr) {

      var queryFunction;
      if (typeof scope.suggestionsSource === 'string') {
        queryFunction = function(query) {
          queryService.async(query, scope.suggestionsSource)
          .then(function (data) {
            scope.suggestions = queryService.returnData(data);
          });
        }
      } else {
        queryFunction = function(query) {
          var trie = new Triejs();
          scope.suggestions = queryService.trie(query, scope.suggestionsSource, trie);
        }
      }
      scope.$watch('query', function (query) {
        if (query) {
          queryFunction(query);
        } else {
          // clear (close) suggestions
          scope.suggestions = null;
        }
      });

      scope.clickItem = function (clickEvent) {
        scope.query = clickEvent.target.innerText;
      };
    },
    scope: {
      suggestionsSource: '='
    },
    templateUrl: 'components/autocomplete/autocomplete-template.html'
  };
}]);
