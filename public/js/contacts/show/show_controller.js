App.module("ContactsApp.Show", function(Show, App){
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
});