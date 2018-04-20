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
                        return '#9e9e9e';
                    },


                },

            };

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')

                .withDOM('frtip')
                .withDataProp('data')
                .withOption('responsive', true)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('serverSide', false)
                .withDataProp('peers')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var pageNum = (data.start / data.length) + 1;
                    PeerService.getPeers(pageNum, data.length).then(function (response) {

                        var data = {'peers': response};
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'peers': data.peers
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap()
                .withOption('rank', [1, 'desc'])
                .withOption('rowReordering', true);

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('rank').withTitle('Rank').notSortable()
                .renderWith(function (data, type, row, meta) {
                    return (data).toFixed(2);
                }),

                DTColumnBuilder.newColumn('_id').withTitle('IP').notSortable()
                  .renderWith(function (data, type, row, meta) {
                    return '<a type="button" class="btn btn-infinity btn-xs" style="width:75%;" ng-controller="SearchCtrl" ng-click="searchIP(\'' +
                    row._id + '\' )"></strong>' + data + '</strong></a>';
                  }),

                DTColumnBuilder.newColumn('numberOfActivePeers').withTitle('Peers').notSortable(),

                DTColumnBuilder.newColumn('SystemLoadAverage').withTitle('CPU').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var numCPU = parseInt(row.availableProcessors);
                        var loadAvg = parseFloat(row.SystemLoadAverage);
                        var loadPct   = (loadAvg * 100 /  (numCPU * 100) ) * 100;

                        return (loadPct.toFixed(2) + ' %');

                    }),

                DTColumnBuilder.newColumn('history_SystemLoadAverage').withTitle('CPU Load History').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tmpArr = [];

                        for (var i = 0; i < data.length - 30; i++) {

                            var loadAvg = parseFloat(data[i]);
                            var loadPct = (loadAvg * 100 / (1 * 100) ) * 100;

                            tmpArr.push({label: i, value: loadPct});

                        }

                        var dd = [{values: []}];
                        dd[0].values = tmpArr;

                        return '<nvd3 options="chartOptions" data=' + JSON.stringify(dd) + '></nvd3>';

                    }),

                DTColumnBuilder.newColumn('lastBlockchainFeeder').withTitle('Last Feeder').notSortable()
                .renderWith(function (data, type, row, meta) {
                  return '<a class="pointer" ng-controller="SearchCtrl" ng-click="searchIP(\'' +
                  data + '\' )">' + data + '</a>';
                }),

                DTColumnBuilder.newColumn('numberOfBlocks').withTitle('Height').notSortable(),

                DTColumnBuilder.newColumn('version').withTitle('Version').notSortable(),

                DTColumnBuilder.newColumn('superNodeEnable').withTitle('Services').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return getTickMarkUiModel(row.superNodeEnable, 'SuperNode Services Enabled');
                    }),

                DTColumnBuilder.newColumn('enableHallmarkProtection').withTitle('Marked').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return getTickMarkUiModel(row.enableHallmarkProtection, 'Hallmark Protected');
                    }),

                DTColumnBuilder.newColumn('apiServerEnable').withTitle('API').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return getTickMarkUiModel(row.apiServerEnable, 'API Enabled');
                    }),

                DTColumnBuilder.newColumn('geoip').withTitle('Country').notSortable()
                    .renderWith(function (data, type, row, meta) {
                      var toolTipText =  data.country_name;
                      return '<countryflag country="' + data.country_code + '" isSquare="false" uib-tooltip="' + toolTipText  + '"></countryflag>';
                    }),
            ];

            function getTickMarkUiModel(value, toolTipText) {
                if (value === true) {
                    return '<small> <span tooltip-placement="top" uib-tooltip="' + toolTipText +
                        '" class="glyphicon glyphicon-ok" style="color:black"></span></small>';
                } else {
                    return '<small> <span tooltip-placement="top" uib-tooltip="' + toolTipText +
                        '" class="glyphicon glyphicon-remove" style="color:black"></span></small>';
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

                  console.log ( success )

                    $scope.stats = success;

                }, function (error) {

                });
            };
        }]);
