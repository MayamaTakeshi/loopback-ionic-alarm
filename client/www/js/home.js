angular.module('alarmer.home', ['lbServices'])
.controller('HomeTabCtrl', function ($scope, $location, User, Alarm) {
    $scope.currentUser = User.getCurrent();
    $scope.newAlarm = {};
    $scope.alarms = [];

    $scope.timeout = 0;
    $scope.noMoreAlarms = false;

    /**
     * @type {number}
     * @desctipion
     * We search new alarms wich are smaller than the
     * last id we received. Set this value to a high number to be
     * shure that the newest alarms will found
     */
    $scope.lastAlarmDate = undefined;

    /**
     * showAlert()
     * @param {string} data
     * shows a popup with the error
     */
    $scope.showAlert = function (data) {
        $ionicPopup.alert({
            title: 'Error',
            template: data
        })
    };


    /**
     * loadMore()
     * get the next 5 alarms and push them to the current alarms
     */
    $scope.loadMore = function () {
	console.log("loadMore called");
        var where = undefined;
	if($scope.lastAlarmDate) {
	    where = {"date": {'lt': $scope.lastAlarmDate} };
	} else { 
	    where = undefined
        }
       	Alarm 
            .find({
                filter: {
                    order: 'date DESC',
                    limit: '5',
                    where: where
                }
            })
            .$promise
            .then(
            function (res) {
                /**
                 * Check if there are any alarms
                 */
                console.log("Checking data. length=" + res.length);
                if(res.length>0){
                    angular.forEach(res, function (values) {
                       /**
                        * Push these values to the alarms array
                        */
                        values.date = new Date(values.date).toLocaleString(); // it seems looback Angular SDK doesn't take care of converting dates from String to Date so we need to convert the string to a date and then convert it to local time
                        $scope.alarms.push(values);

                    });
                    /**
                    * Save the last alarm we received
                    */
                    console.dir($scope.alarms[$scope.alarms.length - 1]);
                    $scope.lastAlarmDate = $scope.alarms[$scope.alarms.length - 1].date;
                    console.log("maybe more");
                    $scope.noMoreAlarms = false;
                } else {
                    //$scope.$broadcast('scroll.infiniteScrollComplete');
                    //$scope.$broadcast('scroll.refreshComplete');
                    console.log("no more");
                    $scope.noMoreAlarms = true;
                }
            },
            function (err) {
                console.log(err);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
		$scope.noMoreAlarms = true;
            })
            .finally(function () {
                /**
                 * Stop the loading animation
                 */
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            })
    };

    /**
     * @name refresh()
     * @desctiption
     * Function for 'pull to refresh'
     * delete current alarms and reload them
     */
    $scope.refresh = function () {
	console.log("refresh called");
        delete $scope.alarms;
        $scope.alarms = [];
        $scope.lastAlarmDate = undefined;
        $scope.loadMore();
    };

    /**
     * @name saveAlarm()
     * @description
     * Create a new entry in the alarm model
     */
    $scope.saveAlarm = function () {
        var new_date = new Date(new Date().getTime() + (Number($scope.newAlarm.timeout) * 1000)).toJSON();
	console.log('new_date=' + new_date);
        $scope.newAlarm.date = new_date 
        $scope.newAlarm.ownerId = $scope.currentUser.id;
	$scope.newAlarm.triggered = false;
	$scope.noMoreAlarms = true; // We need to disable this here otherwise the interface (home.html) will trigger loadMore()
        Alarm.create($scope.newAlarm,
            function (res) {
                delete $scope.newAlarm;
                console.log("initiating refresh after creation of alarm");
                $scope.refresh();
            },
            function (err) {
                console.log(err)
            })
    };
})
