'use strict';

/* Controllers */

//angular.module('angularRestfulAuth')
angularRestfulAuth
    .controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'generate', function($rootScope, $scope, $location, $localStorage, generate) {

        var mode = 'sandbox'; //sandbox or live
        var client_id = 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM';
        var client_secret = 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM';
        var listPayment = {
            'count': '1',
            'start_index': '1'
        };






       /* var restFunctions = {
            create: function create(data, config, cb) {
                api.executeHttp('POST', this.baseURL, data, config, cb);
            },
            get: function get(id, config, cb) {
                api.executeHttp('GET', this.baseURL + id, {}, config, cb);
            },
            list: function list(data, config, cb) {


                    var baseURL = '/v1/payments/payment/';
                    var operations = ['create', 'get', 'list'];

                if (typeof data === 'function') {
                    config = data;
                    data = {};
                }
                api.executeHttp('GET', this.baseURL, data, config, cb);

                console.log("List Payments Response");
                console.log(JSON.stringify(payment));
            },
            del: function del(id, config, cb) {
                api.executeHttp('DELETE', this.baseURL + id, {}, config, cb);
            },
            //provided for compatibility with 0.* versions
            delete: function del(id, config, cb) {
                api.executeHttp('DELETE', this.baseURL + id, {}, config, cb);
            },
            capture: function capture(id, data, config, cb) {
                api.executeHttp('POST', this.baseURL + id + '/capture', data, config, cb);
            },
            refund: function refund(id, data, config, cb) {
                api.executeHttp('POST', this.baseURL + id + '/refund', data, config, cb);
            },
            update: function update(id, data, config, cb) {
                api.executeHttp('PATCH', this.baseURL + id, data, config, cb);
            },
            cancel: function cancel(id, data, config, cb) {
                api.executeHttp('POST', this.baseURL + id + '/cancel', data, config, cb);
            }
        };*/
        $scope.list = function() {
            var listPayment = {
                'count': '1',
                'start_index': '1',
                'mode': 'sandbox', //sandbox or live
                'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
                'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM',
            baseURL : '/v1/payments/payment/',
            operations : ['create', 'get', 'list']
                }
            generate.list(listPayment, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    console.log("List Payments Response");
                    console.log(JSON.stringify(payment));
                }
            })
        };
        /*$scope.signin = function() {
            var formData = {
                'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
                'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
                }


            Main.signin(formData, function(res) {
                if (res.type == false) {
                    alert(res.data)    
                } else {
                    $localStorage.token = res.data.token;

                    $localStorage.users = usersData;

                    window.location = "/";
                }
            }, function() {
                $rootScope.error = 'Failed to signin';
            })
        };

        $scope.signup = function() {
            var formData = {
                email: $scope.email,
                password: $scope.password
            }

            Main.save(formData, function(res) {
                if (res.type == false) {
                    alert(res.data)
                } else {
                    $localStorage.token = res.data.token;
                    window.location = "/"
                }
            }, function() {
                $rootScope.error = 'Failed to signup';
            })
        };

        $scope.me = function() {
            Main.me(function(res) {
                $scope.myDetails = res;
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })
        };

        $scope.logout = function() {
            Main.logout(function() {
                window.location = "/"
            }, function() {
                alert("Failed to logout!");
            });
        };*/
        $scope.token = $localStorage.token;

    }])

.controller('MeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'generate', function($rootScope, $scope, $location,$localStorage, generate) {
        var listPayment = {
            'count': '1',
            'start_index': '1',
            'mode': 'sandbox', //sandbox or live
            'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
            'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM',
            baseURL : '/v1/payments/payment/',
            operations : ['create', 'get', 'list']
        }
        generate.list(listPayment, function (error, payment) {
            if (error) {
                throw error;
            } else {
                $scope.myDetails = $localStorage.users;
                console.log("List Payments Response");
                console.log(JSON.stringify(payment));
            }
        })


       /* Main.me(function(res) {
            //$scope.myDetails = res.data;
            $scope.myDetails = $localStorage.users;
            //$scope.myDetails = localStorage.getItem('fedor');
                   }, function() {
            $rootScope.error = 'Failed to fetch details';
        })*/
}]);













