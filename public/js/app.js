
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
});