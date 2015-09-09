# angular-autocomplete

I have not used any boilerplate code ([angular-gulp-browserify, ...](https://github.com/jakemmarsh/angularjs-gulp-browserify-boilerplate)).
In such small test project there I did not put effort in usage of automation tools like Gulp. I started with blank project.
I added Angular, jQuery and Bootstrap from CDN.
Considering very small amount of CSS code, I did not use any CSS pre-processors. 
  
I used real data from Google API. I created a directive ```<autocomplete>``` which handles autocompletion.
Result items are build in template.html
```
// autocomplete.js

.directive('autocomplete', ['$http', '$compile', 'queryService', function ($http, $compile, queryService) {
    return {
        restrict: 'E',
        link: function (scope, element, attr) {
            var p = $( "#query-input" );
            $('#auto-wrapper').css('left', p.position().left + 'px');
            $('#auto-wrapper').css('width', p.width() + 'px');

            scope.$watch(attr.ngModel, function (query) {
                if (query) {
                    queryService.async(query).then(function (data) {
                        scope.suggestions = queryService.returnData(data);
                    });
                } else {
                    scope.suggestions = null;
                }
            });
        },
        scope: {
        },
        templateUrl: 'template.html'
    };
}])
```


There is a service named queryService which handles API call.
```
// autocomplete.js

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
```


Directive uses this template to create suggestions' box. 
```
<!--template.html-->

<div class="row">
    <div class="col-xs-4 col-xs-offset-4" id="auto-wrapper" ng-controller="autocompletionCtrl">
        <form>
            <div class="form-group">
                <label for="query-input">Google suggestions:</label>
                <input class="form-control" id="query-input" ng-model="$parent.query" type="text"
                       placeholder="Search query">
            </div>
        </form>
        <div class="suggestion-item-wrapper">
            <div class="suggestion-item" ng-click="clickItem($event)" ng-repeat="suggestion in suggestions">
                {{suggestion}}
            </div>
        </div>
    </div>
</div>
```