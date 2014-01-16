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

var NavigateBookApp = Backbone.View.extend({
    el: "#nav",
    events: {
        "click #show-page" : "showPage",
        "click #add-page"  : "addPage"
    },

    showPage: function(){
        router.navigate("show", {trigger: true});
    },

    addPage: function(){
        router.navigate("books", {trigger: true});
    }
});

var InputBookView = Backbone.View.extend({
    el: "#form-container",
    defaultTitleValue: "Title",
    defaultAuthorValue: "Author",
    initialize: function(options){
        this.books = options.books;
        this.book_title = $("#book-title");
        this.book_author = $("#book-author");
        this.form_book = $("form");

        this.book_title.val(this.defaultTitleValue);
        this.book_title.addClass("inactive-form");
        this.book_author.val(this.defaultAuthorValue);
        this.book_author.addClass("inactive-form");
    },

    events: {
        "click #book-title"     : "clearTitleDefaults",
        "focusout #book-title"  : "setTitleDefaults",
        "click #book-author"    : "clearAuthorDefaults",
        "focusout #book-author" : "setAuthorDefaults",

        "click #add-button"     : "addBook",
    },

    addBook: function(e){
        if( this.book_title.val() != "ace" && this.book_author.val() != "ace" ){
            id = _.uniqueId('book_');
            e.preventDefault();
            books.add({title: this.book_title.val(), author: this.book_author.val(), id: id})
            this.book_title.val("");
            this.book_author.val("");
        }
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

var EditBook = Backbone.View.extend({
    el: "#form-container",
    initialize: function(){
        this.book_id = id;
        this.book = books.get(this.book_id);
        this.book_title = $("#book-title");
        this.book_author = $("#book-author");

        this.book_title.val(this.book.get('title'));
        this.book_author.val(this.book.get('author'));
    },

    events: {
        "click #update-button" : "updateBook"
    },

    updateBook: function(e){
        e.preventDefault();
        this.book.set({author: this.book_author.val(), title: this.book_title.val()});
        router.navigate("show", {trigger: true});
    }

});

var BookListView = Backbone.View.extend({
    initialize: function(options){
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
        this.book_id = id;
    },

    events: {
        "click .edit-book" : "editBook"
    },


    template: _.template("<div class='book' style='border: 1px solid black' data-id=<%= id %>><h2><%= title %></h2><span><%= author %></span><input type='button' class='edit-book btn' value='Edit' style='float: right; margin-top: -30px;'></div>"),

    render: function(){
        this.clear();
        $(this.el).html(this.template({
            title: this.book.get("title"),
            author: this.book.get("author")
        }));

        return this
    },

    editBook: function() {
        router.navigate("edit/" + this.book_id, {trigger: true});
    },

    clear: function(){
        $(this.el).empty();
    }

});

var ShowListView = Backbone.View.extend({

    initialize: function(options){
        this.book = options.books;
    },
    el: ".book-holder",
    render: function(){
        var that = this;
        this.book.each(function(model){
            var childBookShowView = new ShowBook({book:model});
            $(that.el).append(childBookShowView.render().el);
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
    <input type="submit" value="Add" id="add-button" class="btn"> \
  </form> \
  <div id="nav"> \
  <button id="show-page" class="btn">Show</button> \
  </div> \
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

JST["show_view"] = _.template(' <h1>Books Show</h1> \
  <div id="nav"> \
  <button id="add-page" class="btn">Add Book</button> \
  </div> \
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

JST["update_view"] = _.template(' <h1>Update Book</h1> \
  <div id="form-container"> \
  <form> \
    <input type="text" id="book-title"> \
    <input type="text" id="book-author"> \
    <input type="submit" value="Update" id="update-button" class="btn"> \
  </form> \
  <div id="nav"> \
  </div> \
  </div>')

var UpdateView = Backbone.View.extend({
    el: "#some_container",
    template: JST["update_view"],

    render: function(){
        $(this.el).html(this.template());
    }
});

var update_view = new UpdateView();

var Router = Backbone.Router.extend({
    initialize: function(){
        this.book_list = new Books([])
    },

    routes: {
        ""          : "defaultPath",
        "books"     : "booksIndex",
        "show"      : "showBooks",
        "edit/*id"  : "editBook"
    },

    defaultPath: function(){
        $("#some_container").html("");
    },

    booksIndex: function(){
        main_view = new MainView();
        main_view.render();
        books = this.book_list

        var navigateApp = new NavigateBookApp({});
        var input_book = new InputBookView({
            books: books
        });
        var childBookListView = new BookListView({
            books: books
        });

        childBookListView.render();

    },

    showBooks: function(){
        show_view = new ShowView();
        show_view.render();

        var childShowListView = new ShowListView({
            books: this.book_list
        });

        var navigateApp = new NavigateBookApp({});

        childShowListView.render();
    },

    editBook: function(){
        update_view = new UpdateView();
        update_view.render();
        var edit_book = new EditBook({
            books: this.book_list
        });
    }

});

var router = new Router();
Backbone.history.start();


