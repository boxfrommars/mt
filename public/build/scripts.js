/*! tux - v0.1.0 - 2014-01-07 */
var App = new Marionette.Application();

App.addRegions({
    mainRegion: "#main-region",
    dialogRegion: "#dialog-region"
});

App.latency = 1000;

App.navigate = function(route, options){
//    options || (options = {});
    Backbone.history.navigate(route, options);
};
App.getCurrentRoute = function(){
    return Backbone.history.fragment;
};

App.on('all', function(){
    console.log.apply(console, arguments);
});
App.on("initialize:after", function(){
    if(Backbone.history){
        Backbone.history.start();

        if(this.getCurrentRoute() === ""){
            App.trigger("contacts:list");
        }
    }
});;App.module("Common.Views", function(Views, ContactManager, Backbone, Marionette, $){
    Views.Loading = Marionette.ItemView.extend({
        template: "#loading-view",
        onShow: function(){
            var opts = {
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: "#000", // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: "spinner", // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: "30px", // Top position relative to parent in px
                left: "auto" // Left position relative to parent in px
            };
            $("#spinner").spin(opts);
        }
    });
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
            "contacts/:id": 'showContact',
            "contacts/:id/edit": 'editContact'
        }
    });

    var API = {
        listContacts: function(){
            ContactsApp.List.Controller.listContacts();
        },
        showContact: function(id){
            ContactsApp.Show.Controller.showContact(id);
        },
        editContact: function(id){
            ContactsApp.Edit.Controller.editContact(id);
        }
    };

    App.on('contacts:list', function(){
        console.log('good list');
        App.navigate('contacts');
        API.listContacts();
    });
    App.on('contact:show', function(id){
        console.log('good show');
        App.navigate("contacts/" + id);
        API.showContact(id);
    });
    App.on('contact:edit', function(id){
        console.log('good edit');
        App.navigate("contacts/" + id + '/edit');
        API.editContact(id);
    });

    App.addInitializer(function(){
        new ContactsApp.Router({
            controller: API
        });
    });
});;App.module("ContactsApp.Edit", function(Edit, App){
    Edit.Controller = {
        editContact: function(id){ // показываем форму редактирования контакта, вешаем обработчики

            // показываем спиннер, пока загружается контакт
            var loadingView = new App.Common.Views.Loading();
            App.mainRegion.show(loadingView);

            /** @var fetchingContact Deferred object */
            var fetchingContact = App.request("contact:entity", id); // пролучаем Deferred объект контакта

            $.when(fetchingContact).done(function(contact){ // дожидаемся загрузки
                var contactView;
                if (contact !== undefined) {
                    contactView = new Edit.Contact({
                        model: contact
                    });

                    contactView.on("form:submit", function(data){
                        if(contact.save(data)){
                            App.trigger("contact:show", contact.get("id"));
                        } else{
                            contactView.triggerMethod("form:data:invalid", contact.validationError); // триггер события onFormDataInvalid
                        }
                    });
                } else { // если нет такого контакта -- показываем missing
                    contactView = new App.ContactsApp.Show.MissingContact();
                }
                App.mainRegion.show(contactView);
            });
        }
    };
});;App.module('ContactsApp.Edit', function(Edit, App, Backbone, Marionette){

    Edit.Contact = Marionette.ItemView.extend({
        template: '#contact-form',

        events: {
            'click .js-submit': 'saveContact'
        },

        saveContact: function(e){
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            this.trigger('form:submit', data);
        },

        onFormDataInvalid: function(errors){
            var self = this;
            var $view = this.$el;

            var clearFormErrors = function(){
                var $form = $view.find("form");
                $form.find(".help-block").each(function(){
                    $(this).remove();
                });
                $form.find(".form-group.has-error").each(function(){
                    $(this).removeClass("has-error");
                });
            };

            var markErrors = function(value, key){
                var $controlGroup = self.$el.find('#contact-' + key).parent();
                var $errorEl = $('<span>', {class: 'help-block', text: value});
                $controlGroup.append($errorEl).addClass('has-error');
            };

            clearFormErrors();
            _.each(errors, markErrors);
        }
    });
});;App.module('ContactsApp.List', function(List, App){
    List.Controller = {
        listContacts: function(){

            var loadingView = new App.Common.Views.Loading();
            App.mainRegion.show(loadingView);

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

                contactsListView.on('itemview:contact:edit', function(childView, model){
                    console.log('edit clicked');
//                    var view = App.ContactsApp
                    App.trigger("contact:edit", model.get("id"));
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
            "click .js-delete": "deleteClicked",
            "click .js-edit": "editClicked",
            "click .js-show": "showClicked"
        },

        highlightName: function() {
            this.$el.toggleClass('warning');
        },

        deleteClicked: function(e){
            e.stopPropagation();
            this.trigger("contact:delete", this.model);
        },

        showClicked: function(e) {
            e.stopPropagation();
            e.preventDefault();
            this.trigger("contact:show", this.model);
        },

        editClicked: function(e) {
            e.stopPropagation();
            e.preventDefault();
            this.trigger("contact:edit", this.model);
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
            var loadingView = new App.Common.Views.Loading();
            App.mainRegion.show(loadingView);

            var fetchingContact = App.request("contact:entity", id);

            $.when(fetchingContact).done(function(contact){
                var contactView;
                if (contact !== undefined) {

                    contactView = new Show.Contact({
                        model: contact
                    });

                    contactView.on('contact:edit', function(model){
                        App.trigger("contact:edit", model.get("id"));
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
});;//App.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){
App.module("Entities", function(Entities, App, Backbone, Marionette, $){

    Entities.Contact = Backbone.Model.extend({
        urlRoot: "contacts",
        validate: function(attrs /*, options */) {
            var errors = {};
            if (! attrs.firstName) {
                errors.firstName = "can't be blank";
            }
            if (! attrs.lastName) {
                errors.lastName = "can't be blank";
            }
            else{
                if (attrs.lastName.length < 2) {
                    errors.lastName = "is too short";
                }
            }
            return _.isEmpty(errors) ? undefined : errors;
        }
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