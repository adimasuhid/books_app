var BookView = Backbone.View.extend({
    initialize: function(options){
        this.book = options.book;
    },

    events: {
        "click" : "showMeMore",
    },

    className: "lalalala",

    template: _.template("<div class='book' style='border: 1px solid black'><h2><%= title %></h2><span><%= author %></span></div>"),

    render: function(){
        $(this.el).html(this.template({
            title: this.book.get("title"),
            author: this.book.get("author")
        }));

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
    initialize: function(options){
        this.ace = "lallalalaa";
        this.books = options.books;
        this.books.on("add", this.render, this);
    },

    el: ".book-holder",

    render: function(){
        var that = this;

        this.clear();
        this.books.each(function(model){
            var childBookView = new BookView({book: model});
            $(that.el).append(childBookView.render().el);
        });
    },

    clear: function(){
        $(this.el).empty();
    }

});

var Book = Backbone.Model.extend({
    changeTitle: function(title){
        this.set("title", title);
    }
});

var Books = Backbone.Collection.extend({
    model: Book,

    filterWithAuthor: function(){
        return this.filter(function(model){ return model.get("author") != null})
    },

    batchChangeTitle: function(title){
        this.each(function(model){
            model.changeTitle(title);
        });
    }

});

window.books = new Books([
        {title: "Book A", author: "Author A"},
        {title: "Book B", author: "Author B"}
    ])

var childBookListView = new BookListView({
    books: books
});

childBookListView.render();

