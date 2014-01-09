App.module("ContactsApp", function(ContactsApp, App, Backbone, Marionette){

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
});