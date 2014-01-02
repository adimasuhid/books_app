var BookView = Backbone.View.extend({
    events: {
        "click" : "showMeMore",
    },

    className: "lalalala",

    template: _.template("<div class='book' style='border: 1px solid black'><h2>Eloquent Ruby</h2><span>Dave Thomas</span></div>"),

    render: function(){
        $(this.el).html(this.template());

        return this
    },

    showMeMore: function(){
        $(this.el).css("background-color", "green");
    },

    showBookHolder: function(){
        console.log( $(".book-holder") );
    }
});

var BookListView = Backbone.View.extend({
    el: ".book-holder",

    render: function(){
        for (i=0; i<5; i++){
            var childBookView = new BookView();
            $(this.el).append(childBookView.render().el);
        }
    },

    initialize: function(){
        this.childBookView = new BookView();
        this.ace = "lallalalaa"
    },

});

var childBookListView = new BookListView();
childBookListView.render();

