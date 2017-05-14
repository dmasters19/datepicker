angular.module('app', ['ui.bootstrap']);




angular.module('app').controller('MainCtrl', ['$scope', function($scope){

    // Min and max datepicker selections
    $scope.options = {maxDate: new Date(), minDate: new Date(2015, 0, 1)};

    // Datepicker format
    $scope.formats = ['dd-MMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.opendt = [];
    $scope.start_dt = {};
    $scope.end_dt = {};

    // Datepicker clear button
    $scope.clear = function() {
      if ($scope.opendt['start_dt']) {
        $scope.start_dt.value = null;
      } else {
        $scope.end_dt.value = null;
      }
    };

    // Differentiate between start and end datepickers
    $scope.open = function(rng) {
      $scope.opendt[rng] = true;
    };

    // Initialize datepicker date values
    $scope.today = function() {
      $scope.start_dt.value = new Date();
      $scope.end_dt.value = new Date();
    };
    $scope.today();

  }
]);