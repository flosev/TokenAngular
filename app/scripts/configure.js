/* Copyright 2015 PayPal */
"use strict";
//angular.module('angularRestfulAuth')
angularRestfulAuth
    .value(


        //var sdkVersion = exports.sdkVersion = require('../package').version;
        userAgent, 'PayPalSDK/PayPal-node-SDK ',

         default_options , {
            'mode': 'sandbox',
            'schema': 'https',
            'host': 'api.sandbox.paypal.com',
            'port': '',
            'openid_connect_schema': 'https',
            'openid_connect_host': 'api.sandbox.paypal.com',
            'openid_connect_port': '',
            'authorize_url': 'https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1/authorize',
            'logout_url': 'https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1/endsession',
            'headers': {}
        }
);
