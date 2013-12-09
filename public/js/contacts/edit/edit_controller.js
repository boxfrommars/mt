App.module("ContactsApp.Edit", function(Edit, App){
    Edit.Controller = {
        editContact: function(id){
            var loadingView = new App.Common.Views.Loading();
            App.mainRegion.show(loadingView);

            var fetchingContact = App.request("contact:entity", id);

            $.when(fetchingContact).done(function(contact){
                var contactView;
                if (contact !== undefined) {
                    contactView = new Edit.Contact({
                        model: contact
                    });

                    contactView.on("form:submit", function(data){
                        if(contact.save(data)){
                            App.trigger("contact:show", contact.get("id"));
                        } else{
                            contactView.triggerMethod("form:data:invalid", contact.validationError);
                        }
                    });
                } else {
                    contactView = new App.ContactsApp.Show.MissingContact();
                }
                App.mainRegion.show(contactView);
            });
        }
    };
});