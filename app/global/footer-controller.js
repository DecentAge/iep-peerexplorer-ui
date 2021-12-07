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

angular.module('peerExplorer').controller('FooterController', ['PeerService', '$scope', '$rootScope','peerConfig',
    function (PeerService, $scope, $rootScope,peerConfig) {

        $scope.init = function () {
            PeerService.getPeers(1,10).then(function (success) {

                $scope.topNode=success[0]||{};
            });
            $scope.connectedURL=peerConfig.apiUrl;
        };

    }]);
