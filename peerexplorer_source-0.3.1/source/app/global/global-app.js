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

angular.module('peerExplorer', ['peers', 'search', 'ui.router']);

angular.module('peerExplorer')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('peerExplorer', {
            abstract: true,
            url: '/',
            template: '<div ui-view></div>',
        });

        $urlRouterProvider.otherwise('/peers');
    }]);

angular.module('peerExplorer').filter('isEnabled', ['$sce', function ($sce) {
    return function (val) {
        switch (val) {
            case true:
                return '<small> <span class="glyphicon glyphicon-ok" style="color:black"></span> </small>';
            case false:
                return '<small> <span class="glyphicon glyphicon-remove" style="color:black"></span> </small>';
            default:
                return '<small> <span class="glyphicon glyphicon-remove" style="color:black"></span> </small>';
        }
    };
}]);

angular.module('peerExplorer').run(['$rootScope', 'PEER_CONSTANTS', function ($rootScope, PEER_CONSTANTS) {
    $rootScope.options = PEER_CONSTANTS;
}]);

angular.module('peerExplorer').filter('gateways', ['$sce', function ($sce) {
    return function (toolTip, val) {
        switch (toolTip) {
            case 'TenderMint':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">   <span class="label label-default" >TM</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >TM</span>   </span>';
                }
                break;

            case 'ZeroNet':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >ZN</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >ZN</span>  </span>';
                }
                break;
            case 'IPFS':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-warning" >IPFS</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >IPFS</span>  </span>';
                }
                break;

            default:
                return '<small> <span class="glyphicon glyphicon-remove" style="color:red"></span> </small>';
        }
    };
}]);

angular.module('peerExplorer').filter('proxies', ['$sce', function ($sce) {
    return function (toolTip, val) {

        switch (toolTip) {
            case 'BTC':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">   <span class="label label-warning" >BTC</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >BTC</span>   </span>';
                }
                break;

            case 'ETH':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >ETH</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >ETH</span>  </span>';
                }
                break;
            case 'LTC':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >LTC</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >LTC</span>  </span>';
                }
                break;

            case 'XRP':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >XRP</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >XRP</span>  </span>';
                }
                break;

            case 'MKT':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >MKT</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >MKT</span>  </span>';
                }
                break;

            default:
                return '<small> <span class="glyphicon glyphicon-remove" style="color:red"></span> </small>';
        }


    };
}]);

angular.module('peerExplorer').filter('storage', ['$sce', function ($sce) {
    return function (toolTip, val) {

        switch (toolTip) {
            case 'PostgreSQL':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">   <span class="label label-default" >PS</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >PS</span>   </span>';
                }
                break;

            case 'RethinkDB':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >RT</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >RT</span>  </span>';
                }
                break;
            case 'MySQL':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >MY</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >MY</span>  </span>';
                }
                break;

            case 'Mongodb':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-warning" >MO</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >MO</span>  </span>';
                }
                break;


            default:
                return '<small> <span class="glyphicon glyphicon-remove" style="color:red"></span> </small>';
        }


    };
}]);

angular.module('peerExplorer').filter('numericalString', ['$sce',  function ($sce) {
    return function (val) {
        if (!val) {
            val = 0;
        }
        return val.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);
