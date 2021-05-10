/******************************************************************************
 * Copyright © 2017 XIN Community                                             *
 *                                                                            *
 * See the DEVELOPER-AGREEMENT.txt and LICENSE.txt files at  the top-level    *
 * directory of this distribution for the individual copyright  holder        *
 * information and the developer policies on copyright and licensing.         *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * XIN software, including this file, may be copied, modified, propagated,    *
 * or distributed except according to the terms contained in the LICENSE.txt  *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

angular.module('peers',
    ['restangular', 'datatables', 'datatables.bootstrap', 'ui.bootstrap', 'ui.router', 'nvd3', 'ngSanitize','cc.autorefresh', 'ng-countryflags']);

angular.module('peers').constant('peerConfig', {
  'apiUrl': window.getEnvConfig("PEER_EXPLORER_API_URL") || 'http://185.103.75.217:8888/',
  //Replace IP with your own VPS
  'peerEndPoint': 'api/nodes'
});

angular.module('peers').constant('PEER_CONSTANTS', {
    'REFRESH_INTERVAL_MILLI_SECONDS': window.getEnvConfig("CONSTANTS_REFRESH_INTERVAL") || 60000,
    'VERSION': window.getEnvConfig("RELEASE_VERSION") || '0.4.1',
});

angular.module('peers').config(['RestangularProvider', 'peerConfig', '$stateProvider', '$urlRouterProvider',
    function (RestangularProvider, peerConfig, $stateProvider, $urlRouterProvider) {

        RestangularProvider.setBaseUrl(peerConfig.apiUrl);

        $stateProvider.state('peerExplorer.peers', {
            url: '^/peers',
            templateUrl: './peers/peers.html',
            controller: 'PeersCtrl'

        });

    }]);

angular.module('peers').filter('searchTerm', ['$sce', function ($sce) {
    return function (val) {
        if (val) {
            return '<a href="" ng-controller="SearchCtrl" ng-click="search(\'' + val +
                '\')">' + val + '</a>';
        } else {
            return '';
        }
    };
}]);

angular.module('peers').directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function (value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}]);
