angular.module('userControllers', ['userServices'])

    .controller('regCtrl', function ($http, $location, $timeout, User /*, $scope*/ ) {

        var app = this;

        this.regUser = function (regData, valid) {
            app.loading = true;
            app.errorMsg = false;
            if (valid) {
                User.create(app.regData).then(function (data) {
                    if (data.data.success) {
                        app.loading = false;
                        //create success message
                        app.successMsg = data.data.message + '...Redirecting';
                        //redirect home page
                        $timeout(function () {
                            $location.path('/');
                        }, 2000);
                    } else {
                        app.loading = false;
                        //create error message
                        app.errorMsg = data.data.message;
                    }
                });
            } else {
                app.loading = false;
                //create error message
                app.errorMsg = "Please ensure the form is filled properly.";
            }
        };

        this.checkUsername = function (regData) {
            app.checkingUsername = true;
            app.usernameMsg = false;
            app.usernameInvalid = false;

            User.checkUsername(app.regData).then(function (data) {
                if (data.data.success) {
                    app.checkingUsername = false;
                    app.usernameInvalid = false;
                    app.usernameMsg = data.data.message;
                } else {
                    app.checkingUsername = false;
                    app.usernameInvalid = true;
                    app.usernameMsg = data.data.message;
                }
            });
        };


        this.checkEmail = function (regData) {
            app.checkingEmail = true;
            app.emailMsg = false;
            app.emailInvalid = false;

            User.checkEmail(app.regData).then(function (data) {
                if (data.data.success) {
                    app.checkingEmail = false;
                    app.emailInvalid = false;
                    app.emailMsg = data.data.message;
                } else {
                    app.checkingEmail = false;
                    app.emailInvalid = true;
                    app.emailMsg = data.data.message;
                }
            });
        };

    })



    .directive('match', function () {
        return {
            restrict: 'A',
            controller: function ($scope) {
                
                $scope.confirmed = false;
                
                $scope.doConfirm = function (values) {
                    values.forEach(function(ele){
                        
                        if($scope.confirm == ele){
                            $scope.confirmed = true;
                        }else {
                            $scope.confirmed = false;
                        }
                    })
                }
            },
            link: function (scope, element, attrs) {

                // Grab the attribute and observe it            
                attrs.$observe('match', function () {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
                
                scope.$watch('confirm', function(){
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
                
            }


        };
    })


    .controller('facebookCtrl', function ($routeParams, Auth, $location, $window) {

        var app = this;

        console.log($window.location.pathname);
        if ($window.location.pathname == '/facebookerror') {
            app.errorMsg = 'Facebook e-mail not found in database.';
            console.log('pathname facebookerror');
        } else {
            Auth.facebook($routeParams.token);
            $location.path('/');
        }

    });
