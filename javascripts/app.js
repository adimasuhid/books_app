var BookView = Backbone.View.extend({
    initialize: function(options){
        this.book = options.book;

    },

    events: {
        "click" : "deleteBook",
    },
    template: _.template("<div class='book' style='border: 1px solid black' data-id=<%= id %>><h2><%= title %></h2><span><%= author %></span></div>"),

    render: function(){
        this.clear();
        $(this.el).html(this.template({
            title: this.book.get("title"),
            author: this.book.get("author")
        }));

        return this
    },

    showBookHolder: function(){
        console.log( $(".book-holder") );
    },
    deleteBook: function(){
        this.book.collection.remove(this.book.id);
        console.log(this);
        console.log(this.book.id)
        this.remove();
    },

    clear: function(){
        $(this.el).empty();
    }

});

var InputBookView = Backbone.View.extend({
    el: "#form-container",
    defaultTitleValue: "Title",
    defaultAuthorValue: "Author",
    initialize: function(){
        this.book_title = $("#book-title");
        this.book_author = $("#book-author");
        this.form_book = $("form");

        this.book_title.val(this.defaultTitleValue);
        this.book_title.addClass("inactive-form");
        this.book_author.val(this.defaultAuthorValue);
        this.book_author.addClass("inactive-form");
    },
    render: function() {
        this.clear();
    },
    events: {
        "click #book-title": "clearTitleDefaults",
        "focusout #book-title": "setTitleDefaults",
        "click #book-author": "clearAuthorDefaults",
        "focusout #book-author": "setAuthorDefaults",

        "click #add-button": "addBook"
    },

    addBook: function(e){
        id = _.uniqueId('book_');
        e.preventDefault();
        books.add({title: this.book_title.val(), author: this.book_author.val(), id: id})
        this.book_title.val("");
        this.book_author.val("");
    },

    clearTitleDefaults: function(){
        if( this.book_title.hasClass("inactive-form") ){
            this.book_title.addClass("active-form")
                           .removeClass("inactive-form");
            this.book_title.val("");
        }
    },
    clearAuthorDefaults: function(){
        if( this.book_author.hasClass("inactive-form") ){
            this.book_author.addClass("active-form")
                           .removeClass("inactive-form");
            this.book_author.val("");
        }
    },

    clear: function(){
        $(this.el).empty();
    }

});

var input_book = new InputBookView();

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

books = new Books([])

var childBookListView = new BookListView({
    books: books
});

childBookListView.render();

