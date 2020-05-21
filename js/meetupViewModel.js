define(function (require) {
  var ko = require('knockout'),
    moment = require('moment'),
    _ = require('underscore');


  var MeetupViewModel = function() {

      var vm = {};
      vm.nextMeetup = ko.observable();
      vm.subsequentMeetups = ko.observableArray();
      vm.archivedMeetups = ko.observableArray();

      // Events API Documentation: https://www.meetup.com/meetup_api/docs/:urlname/events/#list
      var upcomingMeetupsUrl = "https://api.meetup.com/rva-js/events?&sign=true&photo-host=public&page=20&status=upcoming";
      var archivedMeetupsUrl = "https://api.meetup.com/rva-js/events?&sign=true&photo-host=public&page=500&desc=true&status=past";


      function convertMeetup(meetup) {
        meetup = meetup || {};

        var meetupTime = moment(meetup.time);
        meetup.detailedDateTime = meetupTime.format('dddd, MMMM D [at] h:mma');
        meetup.detailedDate = meetupTime.format('MMMM D, YYYY');
        meetup.event_url = meetup.link;
        meetup.year = meetupTime.year();
        
        return meetup;
      };

      vm.loadArchivedMeetups = function() {
        $.ajax({
            url: archivedMeetupsUrl,
            jsonp: "callback",
            dataType: "jsonp",
            success: function (results) {
                console.log("Archived Meetups", results.results);
                vm.archivedMeetups(
                  _.reject(_.map(results.results, convertMeetup), function(m) { return m.year > 2100 })
                );
                console.log("Archived Meetups (converted)", vm.archivedMeetups());
            }
        });
      };

      vm.loadUpcomingMeetups = function() {
          $.ajax({
              url: upcomingMeetupsUrl,
              jsonp: "callback",
              dataType: "jsonp",
              success: function (results) {
                  console.log("Upcoming Meetups", results.results);
                  // Only the first meetup
                  if (results.results.length) {
                    var next = convertMeetup(results.results[0]);
                    vm.nextMeetup(next);
                  } else {
                    vm.nextMeetup({});
                  }
                  // Remove the first meetup from the list
                  results.results.shift();
                  vm.subsequentMeetups(
                    _.map(
                        _.reject(results.results, function(m) { return m.year > 2100 || (m.name === "TBA" && m.description === "<p>TBA</p>"); }),
                      convertMeetup)
                  );
                  console.log("Next Meetup (converted)", vm.nextMeetup());
                  console.log("Subsequent Meetups (converted)", vm.subsequentMeetups());
              }
          });
      };

      return vm;
  };

  return MeetupViewModel;

});
