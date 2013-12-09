App.module("ContactsApp.Show", function(Show, App, Backbone, Marionette){

    Show.Contact = Marionette.ItemView.extend({
        template: '#contact-view',

        events: {
            'click .js-edit': 'editContact'
        },

        editContact: function(e){
            e.preventDefault();
            console.log(this.model);
            this.trigger('contact:edit', this.model);
        }
    });

    Show.MissingContact = Marionette.ItemView.extend({
        template: "#missing-contact-view"
    });
});