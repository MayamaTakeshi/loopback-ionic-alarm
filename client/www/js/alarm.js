angular.module('alarmer.alarm', ['lbServices', 'ionic'])
    .controller('AlarmCtrl', function ($scope, $location, User, $stateParams, Alarm) {
        $scope.currentUser = User.getCurrent();
        $scope.alarm = {};

        /**
         * Find the alarm by the id from the URL
         */
       	Alarm 
            .find({filter: {where: {id: $stateParams.id}}})
            .$promise
            .then(
            function (res) {
                $scope.alarm = res[0];
            },
            function (err) {

            });
    });
