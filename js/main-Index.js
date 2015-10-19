define(function (require) {
    var $ = require('jquery'),
        ko = require('knockout');
        MeetupViewModel = require('meetupViewModel'),
        logo = require('logo');

    $(function () {
        var vm = new MeetupViewModel();
        ko.applyBindings(vm);
        vm.loadUpcomingMeetups();
        logo();
    });
});
