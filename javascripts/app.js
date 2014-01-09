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

    deleteBook: function(){
        this.book.collection.remove(this.book.id);
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
    events: {
        "click #book-title": "clearTitleDefaults",
        "focusout #book-title": "setTitleDefaults",
        "click #book-author": "clearAuthorDefaults",
        "focusout #book-author": "setAuthorDefaults",

        "click #add-button": "addBook",
        "click #show-book": "showBook"
    },

    addBook: function(e){
        id = _.uniqueId('book_');
        e.preventDefault();
        books.add({title: this.book_title.val(), author: this.book_author.val(), id: id})
        this.book_title.val("");
        this.book_author.val("");
    },

    showBook: function(){
        router.navigate("show", {trigger: true});
        router.on("route:booksIndex", function(books) {
            console.log(books);
        });

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


var ShowBook = Backbone.View.extend({
    initialize: function(options){
        this.book = options.book;
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

    clear: function(){
        $(this.el).empty();
    }

});


var ShowListView = Backbone.View.extend({

    initialize: function(options){
        this.book = options.books;
        console.log(this.book);
    },
    el: ".book-holder",
    render: function(){
        var that = this;
        this.books.each(function(model){
            var childBookShowView = new ShowBook({book:model});
            $(that.el).append(childBookView.render().el);
        });
    },
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

var JST = {}
JST["main_view"] = _.template(' <h1>Books App</h1> \
  <div id="form-container"> \
  <form> \
    <input type="text" id="book-title"> \
    <input type="text" id="book-author"> \
    <input type="submit" value="Add" id="add-button"> \
    <button id="show-book">Show</button>\
  </form> \
  <span></span> \
  </div> \
  <div class="book-holder" style="height: 500px; border: 1px solid red;"> \
  </div>')

var MainView = Backbone.View.extend({
    el: "#some_container",
    template: JST["main_view"],

    render: function(){
        $(this.el).html(this.template());
    }
});

var main_view = new MainView();

var JST = {}
JST["show_view"] = _.template(' <h1>Books Show</h1> \
  <div class="book-holder" style="height: 500px; border: 1px solid red;"> \
  </div>')

var ShowView = Backbone.View.extend({
    el: "#some_container",
    template: JST["show_view"],

    render: function(){
        $(this.el).html(this.template());
    }
});

var show_view = new ShowView();

var Router = Backbone.Router.extend({
    routes: {
        "" : "defaultPath",
        "books" : "booksIndex",
        "show" :  "showBooks"
    },

    defaultPath: function(){
        console.log("lalala");
        $("#some_container").html("");
    },

    booksIndex: function(){
        console.log ("andito ko sa books Index");
        //printing
        main_view = new MainView();
        main_view.render();
        var input_book = new InputBookView();
        books = new Books([])

        var childBookListView = new BookListView({
            books: books
        });

        childBookListView.render();

    },

    showBooks: function(){
        show_main = new ShowView();
        show_view.render();

        //var books = new Books([])
        //var childShowListView = new ShowListView({
            //books: books
        //});

        //childShowListView.render();
    }
});

var router = new Router();
Backbone.history.start();


