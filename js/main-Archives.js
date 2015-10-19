define(function (require) {
    var $ = require('jquery'),
        ko = require('knockout');
        MeetupViewModel = require('meetupViewModel');

    $(function () {
        var vm = new MeetupViewModel();
        ko.applyBindings(vm);
        vm.loadArchivedMeetups();
    });
});
