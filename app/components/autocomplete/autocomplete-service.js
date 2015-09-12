'use strict';

angular.module('myApp.autocomplete.autocomplete-service', [])
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
