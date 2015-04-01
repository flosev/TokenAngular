'use strict';

/* Controllers */

//angular.module('angularRestfulAuth')
angularRestfulAuth
    .controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'api', function($rootScope, $scope, $location, $localStorage, api) {
        function mixin(destObject, operations) {
            operations.forEach(function (property) {
                destObject[property] = restFunctions[property];
            });
            return destObject;
        }

        var restFunctions = {
            create: function create(data, config, cb) {
                api.executeHttp('POST', this.baseURL, data, config, cb);
            },
            get: function get(id, config, cb) {
                api.executeHttp('GET', this.baseURL + id, {}, config, cb);
            },
            list: function list(data, config, cb) {

                paypal.configure({
                    'mode': 'sandbox', //sandbox or live
                    'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
                    'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
                });

                var listPayment = {
                    'count': '1',
                    'start_index': '1'
                };

                paypal.payment.list(listPayment, function (error, payment) {
                    if (error) {
                        throw error;
                    } else {
                        console.log("List Payments Response");
                        console.log(JSON.stringify(payment));
                    }
                });

                if (typeof data === 'function') {
                    config = data;
                    data = {};
                }
                api.executeHttp('GET', this.baseURL, data, config, cb);
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
        };
       /* $scope.signin = function() {
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
        };
        $scope.token = $localStorage.token;*/

    }])

.controller('MeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', function($rootScope, $scope, $location,$localStorage, Main) {

        Main.me(function(res) {
            //$scope.myDetails = res.data;
            $scope.myDetails = $localStorage.users;
            //$scope.myDetails = localStorage.getItem('fedor');
            //$scope.myDetails = localStorage.getItem('cart');



            //$scope.myDetails = allData;




             //отработало
               /* var item = localStorage.getItem('fedor');
            $scope.myDetails =  parseValue(item);

             function parseValue(res) {
            var val;
            try {
                val = angular.fromJson(res);
                if (typeof val === 'undefined') {
                    val = res;
                }
                if (val === 'true') {
                    val = true;
                }
                if (val === 'false') {
                    val = false;
                }
                if ($window.parseFloat(val) === val && !angular.isObject(val)) {
                    val = $window.parseFloat(val);
                }
            } catch (e) {
                val = res;
            }
            return val;
        };
*/


            /*var prefix = self.prefix;
            if (prefix.substr(-1) !== '.') {
                prefix = !!prefix ? prefix + '.' : '';
            }
            var deriveQualifiedKey = function(key) {
                return prefix + key;
            };
            var getFromLocalStorage = function (key) {


                var item = webStorage ? webStorage.getItem(deriveQualifiedKey(key)) : null;
                // angular.toJson will convert null to 'null', so a proper conversion is needed
                // FIXME not a perfect solution, since a valid 'null' string can't be stored
                if (!item || item === 'null') {
                    return null;
                }

                if (item.charAt(0) === "{" || item.charAt(0) === "[" || isStringNumber(item)) {
                    return fromJson(item);
                }

                return item;
            };*/
        }, function() {
            $rootScope.error = 'Failed to fetch details';
        })
}]);













