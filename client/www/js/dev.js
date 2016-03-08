angular.module('alarmer.dev', ['lbServices', 'ionic'])
    .controller('DevCtrl', function ($scope, User) {
        /**
         * Blank page for testing purposes
         */
        $scope.currentUser = User.getCachedCurrent()

    });
