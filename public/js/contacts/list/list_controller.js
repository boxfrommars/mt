App.module('ContactsApp.List', function(List, App){
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
            });
        }
    };
});