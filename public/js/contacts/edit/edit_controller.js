App.module("ContactsApp.Edit", function(Edit, App){
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
});