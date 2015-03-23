'use strict';

angular.module('meetings.report', [])
  .directive('reportDialog', ['conferenceAPI', '$alert', 'notificationFactory', '$log', function(conferenceAPI, $alert, notificationFactory, $log) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/views/modules/report/report-dialog.html',
      link: function($scope, element, attrs) {

        $scope.element = element;

        $scope.alertDisplayed = null;

        $scope.element.on('show.bs.modal', function() {
          $scope.reportedText = '';
        });

        $scope.element.on('shown.bs.modal', function() {
          ($('#reportModal').find($('textarea')))[0].focus();
        });

        $scope.hide = function() {
          $scope.element.modal('hide');
        };

        $scope.sendReport = function() {

          var description = $scope.reportedText;
          $scope.resetModal();

          var getArrayOfMemberId = function(arrayOfMembers) {
            return arrayOfMembers.filter(Boolean).map(function(e) { return e.id; });
          };

          conferenceAPI.createReport($scope.reportedAttendee.id, $scope.conferenceState.conference._id, getArrayOfMemberId($scope.conferenceState.attendees), description).then(
            function(response) {
              $log.info('Successfully created report with response', response);
              notificationFactory.weakInfo('Report ' + $scope.reportedAttendee.displayName, 'Report has been sent !');
              $scope.hide();
            },
            function(err) {
              $log.error('Failed to create report', err);
              $scope.displayError('Failed to create report');
            }
          );
        };

        $scope.displayError = function(err) {
          $scope.alertDisplayed = $alert({
            content: err,
            type: 'danger',
            show: true,
            position: 'bottom',
            container: '#reporterror',
            animation: 'am-fade'
          });
        };

        $scope.resetModal = function() {
          if ($scope.alertDisplayed) {
            $scope.alertDisplayed.destroy();
            $scope.alertDisplayed = null;
          }
          $scope.reportedText = '';
        };

      }
    };
  }]);
