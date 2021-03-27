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

angular.module('search',
    ['restangular', 'datatables', 'datatables.bootstrap', 'ui.bootstrap', 'ui.router','nvd3','ngSanitize']);

angular.module('search').constant('searchConfig', {
  'searchEndPoint': 'api/nodes',
});

angular.module('search').config(['RestangularProvider', 'searchConfig', '$stateProvider', '$urlRouterProvider', 'peerConfig',
    function (RestangularProvider, searchConfig, $stateProvider, $urlRouterProvider, peerConfig) {
        RestangularProvider.setBaseUrl(peerConfig.apiUrl);

        $stateProvider.state('peerExplorer.search', {
            url: '^/search',
            templateUrl: './search/search.html',
            controller: 'SearchCtrl'

        });
    }]);

angular.module('search').filter('html', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);
