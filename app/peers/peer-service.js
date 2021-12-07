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
        var lastFetched = {
            getPeers: {
                params: null,
                time: null,
                deferred: null,
            },
            getStats: {
                time: null,
                deferred: null,
            },
        };

        this.getPeers = function (page, results) {
                var params = {
                    'page': page,
                    'results': results,
                    'filter': 'numberOfActivePeers',
                    'order': 'desc'
                };

                var lastFetch = lastFetched.getPeers.time;
                if (lastFetched.getPeers.deferred && JSON.stringify(params) === lastFetched.getPeers.params && lastFetch !== null && new Date().getTime() - lastFetch < 1000) {
                    return lastFetched.getPeers.deferred.promise;
                }

                lastFetched.getPeers.deferred = $q.defer();

                lastFetched.getPeers.time = new Date().getTime();
                lastFetched.getPeers.params = JSON.stringify(params);
                Restangular.all(peerConfig.peerEndPoint).customGET('', params).then(function (resp) {
                    lastFetched.getStats.deferred.resolve(resp);
                });
                return lastFetched.getPeers.deferred.promise;
            };

            this.getStats = function () {
                var lastFetch = lastFetched.getStats.time;

                if (lastFetched.getStats.deferred && lastFetch !== null && new Date().getTime() - lastFetch < 1000) {
                    return lastFetched.getStats.deferred.promise;
                }

                lastFetched.getStats.deferred = $q.defer();

                lastFetched.getStats.time = new Date().getTime();
                Restangular.all('api').one('getStats').customGET('', '').then(function (resp) {
                    lastFetched.getStats.deferred.resolve(resp);
                });
                return lastFetched.getStats.deferred.promise;
            };

    }]);
