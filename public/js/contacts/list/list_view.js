App.module("ContactsApp.List", function(List, App, Backbone, Marionette){
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
});