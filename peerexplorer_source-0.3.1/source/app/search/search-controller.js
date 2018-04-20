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

angular.module('search').controller('SearchCtrl',
    ['$scope', 'SearchService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'searchConfig', 'peerConfig',
        function ($scope, SearchService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile,
                  searchConfig, peerConfig) {

            var errorHandler = function (errorMessage) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'search/search-error.html',
                    size: 'sm',
                    controller: 'ErrorSearchCtrl',

                    resolve: {
                        params: function () {
                            return {
                                message: errorMessage
                            };
                        }
                    }
                });
            };

            function validateIPaddress(ipaddress) {
                if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                        ipaddress)) {
                    return true;
                }
                return (false);
            }

            $scope.search = function (searchTerm) {
                searchTerm = searchTerm||$scope.searchTerm;
                if (searchTerm) {
                    if (validateIPaddress(searchTerm)) {
                        SearchService.searchIp(searchTerm).then(function (response) {



                                if (response._id) {
                                    $uibModal.open({
                                        animation: true,
                                        templateUrl: 'search/search-peer.html',
                                        size: 'lg',
                                        controller: 'SearchIpCtrl',
                                        windowClass: 'block-modal-window',
                                        resolve: {
                                            params: function () {
                                                return {
                                                    node: response
                                                };
                                            }
                                        }
                                    });
                                } else {
                                    errorHandler(searchTerm + ' ip doesn\'t exists ');
                                }
                            }
                        );
                    } else {
                        errorHandler('Please enter valid ip address');
                    }
                }

            };

            $scope.searchIP = function (searchTerm) {

                if (searchTerm) {
                    if (validateIPaddress(searchTerm)) {
                        SearchService.searchIp(searchTerm).then(function (response) {
                                if (response._id) {
                                    $uibModal.open({
                                        animation: true,
                                        templateUrl: 'search/search-peer.html',
                                        size: 'lg',
                                        controller: 'SearchIpCtrl',
                                        windowClass: 'block-modal-window',
                                        resolve: {
                                            params: function () {
                                                return {
                                                    node: response
                                                };
                                            }
                                        }
                                    });
                                } else {
                                    errorHandler(searchTerm + ' ip doesn\'t exists ');
                                }
                            }
                        );
                    } else {
                        errorHandler('Please enter valid ip address');
                    }
                }

            };

        }]);

angular.module('search')
    .controller('SearchIpCtrl',
        ['$scope', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', '$uibModalInstance', '$q', 'params',
            function ($scope, DTOptionsBuilder, DTColumnBuilder, $compile, $uibModalInstance, $q, params) {

              $scope.chartOptions = {
                  chart: {
                      type: 'discreteBarChart',
                      height: 100,
                      margin : {
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 0
                      },
                      x: function(d){return d.label;},
                      y: function(d){return d.value;},
                      showValues: false,
                      valueFormat: function(d){
                          return d3.format(',.2f')(d);
                      },
                      duration: 500,
                      xAxis: {
                          axisLabel: '',
                          ticks: 8
                      },
                      yAxis: {
                          axisLabel: '',
                          axisLabelDistance: 0,
                          ticks: 8
                      },

                      color: function(){
                        return '#9e9e9e';
                      },


                  },

              };

              function buildChartDataArray(data){
                var obj = {
                    key: 'SystemLoad',
                    values: []
                };

                for (var i = 0; i < data.length; i++) {
                  obj.values.push( { label: i, value: data[i] } );
                }
                return [obj];
              }

              function buildChartSystemLoadAverage(data){
                var obj = {
                    key: 'SystemLoad',
                    values: []
                };

                for (var i = 0; i < data.length; i++) {

                  var loadAvg = parseFloat( data[i] );
                  var loadPct  = (loadAvg * 100 /  (1 * 100) ) * 100;
                  obj.values.push( { label: i, value: loadPct } );

                }

                return [obj];

              }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.showResult = function () {

                    $scope.node = params.node;

                    $scope.chartOptions = $scope.chartOptions;
                    $scope.chartData1 =  buildChartSystemLoadAverage(  params.node.history_SystemLoadAverage );
                    $scope.chartData2 =  buildChartDataArray(  params.node.history_freeMemory );
                    $scope.chartData3 =  buildChartDataArray(  params.node.history_requestProcessingTime );
                    $scope.chartData4 =  buildChartDataArray(  params.node.history_numberOfActivePeers );
                };


            }]);

angular.module('search').controller('ErrorSearchCtrl', ['$scope', '$uibModalInstance', '$q', 'params',
    function ($scope, $uibModalInstance, $q, params) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.showResult = function () {
            $scope.message = params.message;
        };
    }]);
