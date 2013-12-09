//App.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){
App.module("Entities", function(Entities, App, Backbone, Marionette, $){

    Entities.Contact = Backbone.Model.extend({
        urlRoot: "contacts"
    });

    Entities.configureStorage(Entities.Contact); // for local storage only

    Entities.ContactCollection = Backbone.Collection.extend({
        model: Entities.Contact,
        url: 'contacts'
    });

    Entities.configureStorage(Entities.ContactCollection); // for local storage only

    var initializeContacts = function(){
        var contacts = new Entities.ContactCollection([
            { id: 1, firstName: 'Alice',   lastName: 'Arten',    phoneNumber: '555-0184' },
            { id: 2, firstName: 'Bob',     lastName: 'Brigham',  phoneNumber: '555-0163' },
            { id: 3, firstName: 'Charlie', lastName: 'Campbell', phoneNumber: '555-0129' }
        ]);

        contacts.forEach(function(contact){
            contact.save();
        });

        return contacts.models;
    };

    var API = {
        getContactEntities: function(){
            var contacts = new Entities.ContactCollection();
            var defer = $.Deferred();
            window.setTimeout(function(){
                contacts.fetch({
                    success: function(data) {
                        defer.resolve(data);
                    }
                });
            }, App.latency);

            var promise = defer.promise();

            $.when(promise).done(function(contacts){
                if (contacts.length === 0) {
                    var models = initializeContacts();
                    contacts.reset(models);
                }
            });

            return defer.promise();
        },

        getContactEntity: function(id){
            var contact = new Entities.Contact({id: id});
            var defer = $.Deferred();
            window.setTimeout(function(){
                contact.fetch({
                    success: function(data){
                        defer.resolve(data);
                    },
                    error: function(){
                        defer.resolve(undefined);
                    }
                });
            }, App.latency);

            return defer.promise();
        }

    };

    App.reqres.setHandler("contact:entities", function(){
        return API.getContactEntities();
    });

    App.reqres.setHandler("contact:entity", function(id){
        return API.getContactEntity(id);
    });
});