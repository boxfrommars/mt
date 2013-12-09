App.module('ContactsApp.Edit', function(Edit, App, Backbone, Marionette){

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
            }

            var markErrors = function(value, key){
                var $controlGroup = self.$el.find('#contact-' + key).parent();
                var $errorEl = $('<span>', {class: 'help-block', text: value});
                $controlGroup.append($errorEl).addClass('has-error');
            }
            clearFormErrors();
            _.each(errors, markErrors);
        }
    });
});