/*! tux - v0.1.0 - 2013-12-05 */
var App = new Marionette.Application();

App.addRegions({
    mainRegion: "#main-region"
});;App.module("Entities", function(Entities, ContactManager, Backbone){

    App.Contact = Backbone.Model.extend({});

    App.ContactCollection = Backbone.Collection.extend({
        model: App.Contact
    });

    var contacts;
    var initializeContacts = function(){
        contacts = new Entities.ContactCollection([
            { id: 1, firstName: "Alice", lastName: "Arten",
                phoneNumber: "555-0184" },
            { id: 2, firstName: "Bob", lastName: "Brigham",
                phoneNumber: "555-0163" },
            { id: 3, firstName: "Charlie", lastName: "Campbell",
                phoneNumber: "555-0129" }
        ]);
    };

    var API = {
        getContactEntities: function(){
            if(contacts === undefined){
                initializeContacts();
            }
            return contacts;
        }
    };

    console.log(API);
});