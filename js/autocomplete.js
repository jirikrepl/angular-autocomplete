angular.module('app', [])
    .controller('urlCtrl', function ($scope) {
        $scope.url = 'http://suggestqueries.google.com/complete/search?client=firefox&q=';
    })
    .controller('trieCtrl', function ($scope) {
        $scope.states = [
            "Alabama"
            , "Alaska"
            , "Arizona"
            , "Arkansas"
            , "California"
            , "Colorado"
            , "Connecticut"
            , "Delaware"
            , "District Of Columbia"
            , "Florida"
            , "Georgia"
            , "Hawaii"
            , "Idaho"
            , "Illinois"
            , "Indiana"
            , "Iowa"
            , "Kansas"
            , "Kentucky"
            , "Louisiana"
            , "Maine"
            , "Maryland"
            , "Massachusetts"
            , "Michigan"
            , "Minnesota"
            , "Mississippi"
            , "Missouri"
            , "Montana"
            , "Nebraska"
            , "Nevada"
            , "New Hampshire"
            , "New Jersey"
            , "New Mexico"
            , "New York"
            , "North Carolina"
            , "North Dakota"
            , "Ohio"
            , "Oklahoma"
            , "Oregon"
            , "Pennsylvania"
            , "Rhode Island"
            , "South Carolina"
            , "South Dakota"
            , "Tennessee"
            , "Texas"
            , "Utah"
            , "Vermont"
            , "Virginia"
            , "Washington"
            , "West Virginia"
            , "Wisconsin"
            , "Wyoming"
        ];
    })
    .factory('queryService', function ($http) {
        return {
            async: function (query, suggestionsSource) {
                var url = suggestionsSource + query;
                return $http.get(url).success(function (data) {
                    return data[1];
                });
            },
            trie: function (query, suggestionsSource) {
                var trie = new Triejs();
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
                scope.$watch('query', function (query) {
                    //console.log(scope.suggestionsSource);
                    if (query) {
                        if (typeof scope.suggestionsSource === 'string') {
                            console.log('url');
                            queryService.async(query, scope.suggestionsSource)
                                .then(function (data) {
                                scope.suggestions = queryService.returnData(data);
                            });
                        } else {
                            console.log('object');
                            scope.suggestions = queryService.trie(query, scope.suggestionsSource);
                        }
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
