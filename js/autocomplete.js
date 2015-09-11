angular.module('app', [])
    .controller('urlCtrl', function ($scope) {
        $scope.url = 'http://suggestqueries.google.com/complete/search?client=firefox&q=';
    })
    .controller('trieCtrl', ['$scope', 'states', function ($scope, states) {
        $scope.states = states;
    }])
    .factory('queryService', function ($http) {
        return {
            async: function (query, suggestionsSource) {
                var url = suggestionsSource + query;
                return $http.get(url).success(function (data) {
                    return data[1];
                });
            },
            trie: function (query, suggestionsSource, trie) {
                for (var i = 0; i < suggestionsSource.length; i++) {
                    trie.add(suggestionsSource[i]);
                }
                return trie.find(query);
            },
            returnData: function (data) {
                return data.data[1];
            }
        };
    })
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
            templateUrl: 'template/template.html'
        };
    }]);
