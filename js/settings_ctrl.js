"use strict";
var ac = angular.module('aboutConfig',[]);

ac.filter('settingsfilter', function() {
    return function(items, searchText) {
      searchText = searchText || '';
      searchText = searchText.toLowerCase();
      //searchText = searchText.toLowerCase();
      items = items || {};
      var filtered = {};
      for (var item in items) {
        if(item.toLowerCase().indexOf(searchText) >= 0 ) {
          filtered[item] = items[item];
        }
      }
     return filtered;
    };
  });

ac.controller('SettingsCtrl', ['$scope', function SettingsCtrl($scope) {
  $scope.allSettings = null;
  $scope.editing = false;
  $scope.editKey = "";
  $scope.editValue = "";
  $scope.editValueValid = true;


  $scope.saveSettings = function saveSettings() {
    var settingsRequest = navigator.mozSettings.createLock().set($scope.allSettings);
    settingsRequest.onsuccess = function (e) {
      console.log("Saved all settings");
      // spinner and some sort of check mark would be nice. meh :)
    };
    settingsRequest.onerror = function (e) {
      alert("Saving all settings has failed!");
    }
  }
  $scope.loadSettings = function loadSettings() {
    console.log("Loading all settings...");
    if ('mozSettings' in navigator && navigator.mozSettings !== null) {
      var settingsRequest = navigator.mozSettings.createLock().get('*');
      settingsRequest.onsuccess = function (e) {
        var settings = e.target.result;
        delete settings['lockscreen.passcode-lock.code'];
        $scope.allSettings = settings; // probably sorted already.

      };
    }
    else {
      console.warn("We don't have the Settings permission, so we're returnign a false object.");
      $scope.allSettings = {
        'test': 'foo',
        'bar': 42,
        'meh': ['yes', 'very'],
        'obj': { 'deep': 23 },
        'long': 'Lorem ipsom dolor sans serif freddy is making stuff up here'
      };

    }
  };

  $scope.viewEdit = function viewEdit(key) {
    scroll(0,0);
    $scope.editKey = key;
    var value = $scope.allSettings[key];
    $scope.expectedType = typeof value;
    $scope.editValue = value;
    $scope.editing = true;
    $scope.editValueValid = true;
    console.log("editing", key, "type:", $scope.expectedType);
  };
  $scope.editValidate = function editValidate() {
    console.log("validating..");
    try {
      var jp = JSON.parse($scope.editValue);
      if (typeof jp == $scope.expectedType) {
        $scope.editValueValid = true;
      }
      else {
        $scope.editValueValid = false;
      }
    } catch(e) {
      if ($scope.expectedType == typeof($scope.editValue)) {
        $scope.editValueValid = true;
      }
      else {
        $scope.editValueValid = false;
      }
    }
  };
  $scope.editSubmit = function editSubmit() {
    var value;
    try {
      value = JSON.parse($scope.editValue);
    }
    catch(e) {
      // fall back to string.
      value = $scope.editValue;
    }
    $scope.allSettings[$scope.editKey] = value;


    $scope.editKey = "";
    $scope.editValue = "";
    $scope.editing = false;
  };
  $scope.editCancel = function editCancel() {
    $scope.editKey = "";
    $scope.editValue = "";
    $scope.editing = false;
  };



  $scope.myTypeOf = function myTypeOf(x) {
    return typeof(x);
  }
}]);