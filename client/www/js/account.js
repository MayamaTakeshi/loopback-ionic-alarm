angular.module('alarmer.account', ['lbServices', 'ionic'])
    .controller('AccountCtrl', function ($scope, $location, User, Alarm) {
        $scope.currentUser = User.getCurrent();

        /**
         * @name logout()
         * logout user and redirect to the login page
         */
        $scope.logout = function () {
            User.logout(function () {
                $location.path('/login');
            });
        }

    });
