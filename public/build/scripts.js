/*! tux - v0.1.0 - 2013-12-09 */
var App = new Marionette.Application();

App.addRegions({
    mainRegion: "#main-region"
});

App.latency = 100;

App.navigate = function(route, options){
//    options || (options = {});
    Backbone.history.navigate(route, options);
};
App.getCurrentRoute = function(){
    return Backbone.history.fragment;
};

App.on("initialize:after", function(){
    if(Backbone.history){
        Backbone.history.start();

        if(this.getCurrentRoute() === ""){
            App.trigger("contacts:list");
        }
    }
});;App.module("Entities", function(Entities, App, Backbone, Marionette, $, _){
    var findStorageKey = function(entity){
        // use a model's urlRoot value
        if(entity.urlRoot){
            return _.result(entity, "urlRoot");
        }
        // use a collection's url value
        if(entity.url){
            return _.result(entity, "url");
        }
        // fallback to obtaining a model's storage key from
        // the collection it belongs to
        if(entity.collection && entity.collection.url){
            return _.result(entity.collection, "url");
        }

        throw new Error("Unable to determine storage key");
    };

    var StorageMixin = function(entityPrototype){
        var storageKey = findStorageKey(entityPrototype);
        return { localStorage: new Backbone.LocalStorage(storageKey) };
    };

    Entities.configureStorage = function(entity){
        _.extend(entity.prototype, new StorageMixin(entity.prototype));
    };
});;App.module("ContactsApp", function(ContactsApp, App, Backbone, Marionette){

    ContactsApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "contacts": 'listContacts',
            "contacts/:id": 'showContact'
        }
    });

    var API = {
        listContacts: function(){
            ContactsApp.List.Controller.listContacts();
        },
        showContact: function(id){
            ContactsApp.Show.Controller.showContact(id);
        }
    };

    App.on('contacts:list', function(){
        App.navigate('contacts');
        API.listContacts();
    });
    App.on('contact:show', function(id){
        App.navigate("contacts/" + id);
        API.showContact(id);
    });

    App.addInitializer(function(){
        new ContactsApp.Router({
            controller: API
        });
    });
});;App.module('ContactsApp.List', function(List, App){
    List.Controller = {
        listContacts: function(){

            var fetchingContacts = App.request('contact:entities');

            $.when(fetchingContacts).done(function(contacts){
                var contactsListView = new List.Contacts({
                    collection: contacts
                });

                App.mainRegion.show(contactsListView);

                contactsListView.on('itemview:contact:delete', function(childView, model){
                    model.destroy();
                });

                contactsListView.on('itemview:contact:show', function(childView, model){
                    App.trigger("contact:show", model.get("id"));
                });
            });
        }
    };
});;App.module("ContactsApp.List", function(List, App, Backbone, Marionette){
    List.Contact = Marionette.ItemView.extend({
        tagName: "tr",
        template: "#contact-list-item",

        events: {
            "click": "highlightName",
            "click .js-delete": "deleteItem",
            "click .js-show": "showItem"
        },

        highlightName: function() {
            this.$el.toggleClass('warning');
        },

        deleteItem: function(e){
            e.stopPropagation();
            this.trigger("contact:delete", this.model);
        },

        showItem: function(e) {
            e.stopPropagation();
            e.preventDefault();
            this.trigger("contact:show", this.model);
        }
    });

    List.Contacts = Marionette.CompositeView.extend({
        tagName: "table",
        template: '#contact-list',
        itemView: List.Contact,
        itemViewContainer: 'tbody',
        className: "table table-hover"
    });
});;App.module("ContactsApp.Show", function(Show, App){
    Show.Controller = {
        showContact: function(id){

            var fetchingContact = App.request("contact:entity", id);

            $.when(fetchingContact).done(function(contact){
                var contactView;
                if (contact !== undefined) {
                    contactView = new Show.Contact({
                        model: contact
                    });
                } else {
                    contactView = new Show.MissingContact();
                }
                App.mainRegion.show(contactView);
            });
        }
    };
});;App.module("ContactsApp.Show", function(Show, App, Backbone, Marionette){

    Show.Contact = Marionette.ItemView.extend({
        template: '#contact-view'
    });

    Show.MissingContact = Marionette.ItemView.extend({
        template: "#missing-contact-view"
    });
});;//App.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){
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