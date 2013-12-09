App.module("ContactsApp.Show", function(Show, App, Backbone, Marionette){

    Show.Contact = Marionette.ItemView.extend({
        template: '#contact-view'
    });

    Show.MissingContact = Marionette.ItemView.extend({
        template: "#missing-contact-view"
    });
});