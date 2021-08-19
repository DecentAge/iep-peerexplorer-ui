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

angular.module('peers').controller('PeersCtrl',
    ['$scope', 'PeerService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        function ($scope, PeerService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile) {

            $scope.chartOptions = {
                chart: {
                    type: 'discreteBarChart',
                    height: 20,
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    x: function (d) {
                        return d.label;
                    },
                    y: function (d) {
                        return d.value;
                    },
                    showValues: false,
                    duration: 500,
                    xAxis: {
                        axisLabel: '',
                        axisLabelDistance: 0,
                        ticks: 0
                    },
                    yAxis: {
                        axisLabel: '',
                        axisLabelDistance: 0,
                        ticks: 0
                    },

                    color: function () {
                        return '#666';
                    },


                },

            };

            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('numbers')
                .withDOM('frtip')
                .withDataProp('data')
                .withOption('responsive', true)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('peers')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var pageNum = (data.start / data.length) + 1;
                    var totalNumberOfNodes = 0;
                    PeerService.getStats().then(function (success) {
                        totalNumberOfNodes = success.activeNodes;
                        PeerService.getPeers(pageNum, data.length).then(function (response) {
                            var data = {'peers': response};
                            callback({
                                'iTotalRecords': totalNumberOfNodes,
                                'iTotalDisplayRecords': totalNumberOfNodes,
                                'peers': data.peers
                            });
                        });
                    }, function (error) {

                    });
                })
                .withDisplayLength(10).withBootstrap()
                .withOption('rank', [1, 'desc'])
                .withOption('rowReordering', true);

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('connected').withTitle('Connected').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return getConnectedUiModel(row.active);
                    }),

                DTColumnBuilder.newColumn('rank').withTitle('Rank').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        if (!row.peerState) {
                            return "n/a";
                        }
                        return (row.peerState.rank).toFixed(2);
                    }),

                DTColumnBuilder.newColumn('_id').withTitle('IP').notSortable()
                  .renderWith(function (data, type, row, meta) {
                      if (!row.peerState) {
                          return data;
                      }

                    return '<a type="button" class="btn btn-infinity btn-xs" style="min-width:100%;" ng-controller="SearchCtrl" ng-click="searchIP(\'' +
                    row._id + '\' )"></strong>' + data + '</strong></a>';
                  }),

                DTColumnBuilder.newColumn('numberOfActivePeers').withTitle('Peers').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        if (!row.peerState) {
                            return "n/a";
                        }

                        return row.peerState.numberOfPeers;
                    }),

                DTColumnBuilder.newColumn('SystemLoadAverage').withTitle('CPU').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        if (!row.peerState) {
                            return "n/a";
                        }

                        var numCPU = parseInt(row.peerState.availableProcessors);
                        var loadAvg = parseFloat(row.peerState.SystemLoadAverage);
                        var loadPct   = (loadAvg * 100 /  (numCPU * 100) ) * 100;

                        return (loadPct.toFixed(2) + ' %');

                    }),

                DTColumnBuilder.newColumn('history_SystemLoadAverage').withTitle('CPU Load History').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        if (!row.peerState) {
                            return "n/a";
                        }

                        var tmpArr = [];

                        var field = row.peerState.history_SystemLoadAverage;

                        console.log(field)

                        for (var i = 0; i < field.length - 30; i++) {

                            var loadAvg = parseFloat(field[i]);
                            var loadPct = (loadAvg * 100 / (1 * 100) ) * 100;

                            tmpArr.push({label: i, value: loadPct});

                        }

                        console.log("VALUES", tmpArr)

                        var dd = [{values: []}];
                        dd[0].values = tmpArr;

                        return '<nvd3 options="chartOptions" data=' + JSON.stringify(dd) + '></nvd3>';

                    }),

                DTColumnBuilder.newColumn('lastBlockchainFeeder').withTitle('Last Feeder').notSortable()
                .renderWith(function (data, type, row, meta) {
                  return '<a class="pointer" ng-controller="SearchCtrl" ng-click="searchIP(\'' +
                  row.peerState.lastBlockchainFeeder + '\' )">' + row.peerState.lastBlockchainFeeder + '</a>';
                }),

                DTColumnBuilder.newColumn('numberOfBlocks').withTitle('Height').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        if (!row.peerState) {
                            return "n/a";
                        }

                        return row.peerState.numberOfBlocks;
                    }),

                DTColumnBuilder.newColumn('version').withTitle('Version').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return row.version;
                    }),

                DTColumnBuilder.newColumn('enableHallmarkProtection').withTitle('Marked').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return getTickMarkUiModel(row.services.includes("HALLMARK"), 'Hallmark Protected');
                    }),

                DTColumnBuilder.newColumn('apiServerEnable').withTitle('API').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return getTickMarkUiModel(row.services.includes("API"), 'API Enabled');
                    }),

                DTColumnBuilder.newColumn('geoip').withTitle('Country').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        if (row.geoip) {
                            var toolTipText = row.geoip.country_name;
                            return '<countryflag country="' + row.geoip.country_code.toLowerCase() + '" isSquare="false" uib-tooltip="' + toolTipText + '"></countryflag>';
                        }
                        return "n/a";
                    }),


            ];

            function getTickMarkUiModel(value, toolTipText) {
                if (value === true) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTipText +
                        '" class="iep-icon-checkbox-checked " style="color:black"></span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTipText +
                        '" class="iep-icon-checkbox-unchecked " style="color:black"></span>';
                }
            }

            function getConnectedUiModel(value) {
                if (value) {
                    return '<span tooltip-placement="right" uib-tooltip="Peer is connected" class="iep-icon-checkbox-checked " style="color:black"></span>';
                } else {
                    return '<span tooltip-placement="right" uib-tooltip="Peer is not connected, trying to reconnect or removing peer" style="color:black"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></span>';
                }
            }

            $scope.dtInstanceCallback= function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadPeers = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };


        }]);

angular.module('peers').controller('StatsCtrl',
    ['$scope', 'PeerService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        function ($scope, PeerService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile) {

            $scope.getStats = function () {
                PeerService.getStats().then(function (success) {

                    $scope.stats = success;

                }, function (error) {

                });
            };
        }]);
