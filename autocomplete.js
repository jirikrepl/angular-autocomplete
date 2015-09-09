angular.module('auto', [])
    .factory('queryService', function ($http) {
        return {
            async: function (query) {
                var url = 'http://suggestqueries.google.com/complete/search?client=firefox&q=' + query;
                return $http.get(url).success(function (data) {
                    return data[1];
                });
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
                var p = $( "#blah" );
                var position = p.position();
                $( "p:last" ).text( "left: " + position.left + ", top: " + position.top );
                $('#auto-wrapper').css('left', position.left + 'px');
                $('#auto-wrapper').css('width', p.width() + 'px');


                scope.$watch(attr.ngModel, function (query) {
                    if (query) {
                        console.log(query);
                        queryService.async(query).then(function (data) {
                            scope.suggestions = queryService.returnData(data);
                        });
                    } else {
                        scope.suggestions = null;
                        console.log('scope.suggestions: ' + scope.suggestions);
                    }
                });
            },
            templateUrl: 'template.html'
        };
    }]);
