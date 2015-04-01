'use strict';

//angular.module('angularRestfulAuth')
angularRestfulAuth
    .factory('api', ['client','configure', function(client, configure) {
//внести зависимости  client и configure
        //var client = require('./client');
        ////var utils = require('./utils');
        //var configuration = require('./configure');
        //from utils.js
        var isArray = Array.isArray;
        var hasOwn = Object.prototype.hasOwnProperty;

        var getDefaultEndpoint =  function getDefaultEndpoint(mode) {
            return (typeof mode === "string" && mode === "live") ? "paypal.com" : "sandbox.paypal.com";
        };

        var getDefaultApiEndpoint = function getDefaultApiEndpoint(mode) {
            return 'api.' + getDefaultEndpoint(mode);
        };

        /**
         * Recursively copies given object into a new object. Helper method for merge
         * @param  {Object} v
         * @return {Object}
         */
        function clone(v) {
            if (v === null || typeof v !== "object") {
                return v;
            }

            if (isArray(v)) {
                var arr = v.slice();
                for (var i = 0; i < v.length; i++) {
                    arr[i] = clone(arr[i]);
                }
                return arr;
            }
            else {
                var obj = {};
                for (var k in v) {
                    obj[k] = clone(v[k]);
                }
                return obj;
            }
        }

        /**
         * Merges two Objects recursively, setting property of obj1 to those of obj2
         * and creating property as necessary.
         *
         * Implementation suggested by @kobalicek on https://github.com/paypal/PayPal-node-SDK/issues/69
         * @param  {Object} obj1
         * @param  {Object} obj2
         * @return {Object}
         */
        var merge =  function merge(obj1, obj2) {

            //Handle invalid arguments
            if (obj1 === null || typeof obj1 !== "object") {
                throw new TypeError("merge() - first parameter has to be an object, not " + typeof obj1 + ".");
            }

            if (obj2 === null || typeof obj2 !== "object") {
                throw new TypeError("merge() - first parameter has to be an object, not " + typeof obj2 + ".");
            }

            if (isArray(obj1) || isArray(obj2)) {
                throw new TypeError("merge() - Unsupported for arrays.");
            }

            for (var k in obj2) {
                var obj1Val, obj2Val = obj2[k];
                if (hasOwn.call(obj1, k)) {
                    obj1Val = obj1[k];
                    if (obj1Val !== null && typeof obj1Val === "object" &&
                        obj2Val !== null && typeof obj2Val === "object") {
                        merge(obj1Val, obj2Val);
                    }
                    else {
                        obj1[k] = clone(obj2Val);
                    }
                }
                else {
                    obj1[k] = clone(obj2Val);
                }
            }
            return obj1;
        };

        /**
         * Checks if access token for client id has expired
         * @param  {Object} token_hash  object returned from paypal access token request
         *                              with expires_in set and sdk sets the created_at
         * @return {Boolean}            true if token expired else false
         */
        var checkExpiredToken =  function checkExpiredToken(token_hash) {
            var delta = (new Date().getTime() / 1000) - token_hash.created_at;
            return (delta < token_hash.expires_in) ? false : true;
        };
        //from utils.js
        /**
         * token_persist client id to access token cache, used to reduce access token round trips
         * @type {Object}
         */
        var token_persist = {};

        /**
         * Set up configuration globally such as client_id and client_secret,
         * by merging user provided configurations otherwise use default settings
         * @param  {Object} options Configuration parameters passed as object
         * @return {undefined}
         */
        var configure = function configure(options) {
            if (options !== undefined && typeof options === 'object') {
                configuration.default_options = utils.merge(configuration.default_options, options);
            }
        };

        /**
         * Generate new access token by making a POST request to /oauth2/token by
         * exchanging base64 encoded client id/secret pair or valid refresh token.
         *
         * Otherwise authorization code from a mobile device can be exchanged for a long
         * living refresh token used to charge user who has consented to future payments.
         * @param  {Object|Function}   config Configuration parameters such as authorization code or refresh token
         * @param  {Function} cb     Callback function
         * @return {String}          Access token or Refresh token
         */
        function updateToken(http_options, error_callback, callback)
        {
            generateToken(http_options, function (error, token) {
                if (error) {
                    error_callback(error, token);
                } else {
                    http_options.headers.Authorization = token;
                    callback();
                }
            });
        }
        return {
            generateToken: function(config, cb) {

                if (typeof config === "function") {
                    cb = config;
                    config = configuration.default_options;
                } else if (!config) {
                    config = configuration.default_options;
                } else {
                    config = utils.merge(config, configuration.default_options);
                }

                var payload = 'grant_type=client_credentials';
                if (config.authorization_code) {
                    payload = 'grant_type=authorization_code&response_type=token&redirect_uri=urn:ietf:wg:oauth:2.0:oob&code=' + config.authorization_code;
                } else if (config.refresh_token) {
                    payload = 'grant_type=refresh_token&refresh_token=' + config.refresh_token;
                }

                var basicAuthString = 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64');

                var http_options = {
                    schema: config.schema || configuration.default_options.schema,
                    host: utils.getDefaultApiEndpoint(config.mode) || config.host || configuration.default_options.host,
                    port: config.port || configuration.default_options.port,
                    headers: {
                        'Authorization': basicAuthString,
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                client.invoke('POST', '/v1/oauth2/token', payload, http_options, function (err, res) {
                    var token = null;
                    if (res) {
                        var seconds = new Date().getTime() / 1000;
                        token_persist[config.client_id] = res;
                        token_persist[config.client_id].created_at = seconds;

                        if (!config.authorization_code) {
                            token = res.token_type + ' ' + res.access_token;
                        }
                        else {
                            token = res.refresh_token;
                        }
                    }
                    cb(err, token);
                });
            },

            /* Update authorization header with new token obtained by calling
             generateToken */
            /**
             * Updates http Authorization header to newly created access token
             * @param  {Object}   http_options   Configuration parameters such as authorization code or refresh token
             * @param  {Function}   error_callback
             * @param  {Function} callback
             */


            /**
             * Makes a PayPal REST API call. Reuses valid access tokens to reduce
             * round trips, handles 401 error and token expiration.
             * @param  {String}   http_method           A HTTP Verb e.g. GET or POST
             * @param  {String}   path                  Url endpoint for API request
             * @param  {Data}   data                    Payload associated with API request
             * @param  {Object|Function}   http_options Configurations for settings and Auth
             * @param  {Function} cb                    Callback function
             */
            executeHttp: function(http_method, path, data, http_options, cb) {
                if (typeof http_options === "function") {
                    cb = http_options;
                    http_options = null;
                }
                if (!http_options) {
                    http_options = configuration.default_options;
                } else {
                    http_options = utils.merge(http_options, configuration.default_options);
                }

                //Get host endpoint using mode
                http_options.host = utils.getDefaultApiEndpoint(http_options.mode) || http_options.host;

                function retryInvoke() {
                    client.invoke(http_method, path, data, http_options, cb);
                }

                if (http_options.correlation_id) {
                    http_options.headers['Paypal-Application-Correlation-Id'] = http_options.correlation_id;
                    http_options.headers['Paypal-Client-Metadata-Id'] = http_options.correlation_id;
                }

                // If client_id exists with an unexpired token and a refresh token is not provided, reuse cached token
                if (http_options.client_id in token_persist && !utils.checkExpiredToken(token_persist[http_options.client_id]) && !http_options.refresh_token) {
                    http_options.headers.Authorization = "Bearer " + token_persist[http_options.client_id].access_token;
                    client.invoke(http_method, path, data, http_options, function (error, response) {
                        // Don't reprompt already authenticated user for login by updating Authorization header
                        // if token expires
                        if (error && error.httpStatusCode === 401 && http_options.client_id && http_options.headers.Authorization) {
                            http_options.headers.Authorization = null;
                            updateToken(http_options, cb, retryInvoke);
                        } else {
                            cb(error, response);
                        }
                    });
                } else {
                    updateToken(http_options, cb, retryInvoke);
                }
            }
        }

        /*var baseUrl = 'https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1/authorize';
         function changeUser(user) {
         angular.extend(currentUser, user);
         }

         function urlBase64Decode(str) {
         var output = str.replace('-', '+').replace('_', '/');
         switch (output.length % 4) {
         case 0:
         break;
         case 2:
         output += '==';
         break;
         case 3:
         output += '=';
         break;
         default:
         throw 'Illegal base64url string!';
         }
         return window.atob(output);
         }



         function getUserFromToken() {
         var token = $localStorage.token;
         var user = {};
         if (typeof token !== 'undefined') {
         var encoded = token.split('.')[1];
         user = JSON.parse(urlBase64Decode(encoded));
         }
         return user;
         }

         var currentUser = getUserFromToken();

         return {
         save: function(data, success, error) {
         $http.post(baseUrl + '/signin', data).success(success).error(error)
         return false;
         },
         signin: function(data, success, error) {
         $http.post(baseUrl + '/authenticate', data).success(success).error(error)
         return false;
         },
         me: function(success, error) {
         $http.get(baseUrl + '/me').success(success).error(error)
         },
         logout: function(success) {
         changeUser({});
         delete $localStorage.token;
         success();
         }
         }


         function getUserData(){
         return JSON.parse($localStorage.getItem('cart'));
         }
         // Save User to LocalStarage
         function setUserData(o){
         $localStorage.setItem('cart', JSON.stringify(o));
         return false;
         }
         // Add User to LocalStorage
         function addToCart(formData){
         //this.disabled = true; // block buton durung saving operation
         //var cartData = getUserData() || {}; // get data from LocalStorage
         //var arrUser = JSON.stringify(formData);
         //cartData[1] = arrUser;
         //localStorage.setItem('cart', JSON.strgify(cartData));
         $localStorage.user = JSON.stringify(formData);
         //cartData[1] = this.e;
         //}
         if(!setCartData(cartData)){ // Обновляем данные в LocalStorage
         this.disabled = false; // разблокируем кнопку после обновления LS
         }
         return false;
         }
         // Устанавливаем обработчик события на каждую кнопку "Добавить в корзину"
         for(var i = 0; i < itemBox.length; i++){
         addEvent(itemBox[i].querySelector('.add_item'), 'click', addToCart);
         }
         // Открываем корзину со списком добавленных товаров
         function openCart(e){
         var cartData = getCartData(), // вытаскиваем все данные корзины
         totalItems = '';
         // если что-то в корзине уже есть, начинаем формировать данные для вывода
         if(cartData !== null){
         totalItems = '<table class="shopping_list"><tr><th>Наименование</th><th>Цена</th><th>Кол-во</th></tr>';
         for(var items in cartData){
         totalItems += '<tr>';
         for(var i = 0; i < cartData[items].length; i++){
         totalItems += '<td>' + cartData[items][i] + '</td>';
         }
         totalItems += '</tr>';
         }
         totalItems += '<table>';
         cartCont.innerHTML = totalItems;
         } else {
         // если в корзине пусто, то сигнализируем об этом
         cartCont.innerHTML = 'В корзине пусто!';
         }
         return false;
         };*/
    }

]);