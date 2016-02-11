define(function (require) {
  var ko = require('knockout'),
    moment = require('moment'),
    _ = require('underscore');


  var MeetupViewModel = function() {

      var vm = {};
      vm.nextMeetup = ko.observable();
      vm.subsequentMeetups = ko.observableArray();
      vm.archivedMeetups = ko.observableArray();

      // Signed URL documentation: http://www.meetup.com/meetup_api/auth/#keysign
      // Events API Endpoint: http://www.meetup.com/meetup_api/docs/2/events/
      var upcomingMeetupsUrl = "https://api.meetup.com/2/events?" +
          "offset=0&format=json&limited_events=False&group_urlname=rva-js&photo-host=public&" +
          "page=20&fields=&order=time&desc=false&status=upcoming&sig_id=97460602&sig=2cd63328f21046e47b67c0ab687418f4ad60710a";

      var archivedMeetupsUrl = "https://api.meetup.com/2/events?" +
          "offset=0&format=json&limited_events=False&group_urlname=rva-js&photo-host=public&" +
          "page=500&fields=&order=time&status=past&desc=false&sig_id=97460602&sig=a2a2077d5e63c3e77d16a5e08429a440b32241e2";


      function convertMeetup(meetup) {
        meetup = meetup || {};

        var meetupTime = moment(meetup.time);
        meetup.detailedDateTime = meetupTime.format('dddd, MMMM D [at] h:mma');
        meetup.detailedDate = meetupTime.format('MMMM D, YYYY');

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
                  _.map(results.results, convertMeetup)
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
                        _.reject(results.results, function(m) { return m.name === "TBA" && m.description === "<p>TBA</p>"; }),
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
