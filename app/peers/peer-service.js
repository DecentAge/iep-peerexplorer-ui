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

angular.module('peers')
    .service('PeerService', ['Restangular', 'peerConfig', '$q', function (Restangular, peerConfig, $q) {
        this.getPeers = function (page, results) {
                var params = {
                    'page': page,
                    'results': results,
                    'filter': 'numberOfActivePeers',
                    'order': 'desc'
                };

                return Restangular.all(peerConfig.peerEndPoint).customGET('', params);
            };

            this.getStats = function () {
                return Restangular.all('api').one('getStats').customGET('', '');
            };

    }]);
