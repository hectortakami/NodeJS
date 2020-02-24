// source ~/.bash_profile
var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    sanitizer = require("express-sanitizer"), //It clears the HTML input for script inyection
    mongoose = require("mongoose"),
    express = require("express"),
    mongoDB = 'mongodb://localhost/blog_app',
    app = express();

// APP CONFIGURATION
app.use(methodOverride("_method"));
app.use(sanitizer());
app.use(express.static("assets"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//SCHEMA SETUP
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var BlogEntry = mongoose.model("BlogEntry", blogSchema);

// RESTful ROUTES
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", (req, res) => {
    BlogEntry.find({}, (err, blogs) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            res.render("index", { blogs: blogs });
    });
});

//CREATE ROUTE
app.post("/blogs", (req, res) => {
    // We can insert HTML to style the blog
    // this can be harming for the system so we eliminate 
    // with the sanitizer any malicious script inside the HTML
    req.body.blog.body = req.sanitize(req.body.blog.body);
    BlogEntry.create({
        title: req.body.blog.title,
        image: req.body.blog.image,
        body: req.body.blog.body
    }, (err, response) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            res.redirect("/blogs");
    });
});

app.get("/blogs/new", (req, res) => {
    res.render("new");
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
    BlogEntry.findById(req.params.id, (err, foundBlog) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            res.render("show", { blog: foundBlog });
    });

});

//UPDATE ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    BlogEntry.findById(req.params.id, (err, foundBlog) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            res.render("edit", { blog: foundBlog });
    });
});

app.post("/blogs/:id", (req, res) => {
    // We can insert HTML to style the blog
    // this can be harming for the system so we eliminate 
    // with the sanitizer any malicious script inside the HTML
    req.body.blog.body = req.sanitize(req.body.blog.body);
    BlogEntry.findByIdAndUpdate(req.params.id, req.body.blog, (err, blogUpdated) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            res.redirect(`/blogs/${req.params.id}`);
    });
});

//DESTROY ROUTE
app.get("/blogs/:id/destroy", (req, res) => {
    BlogEntry.findById(req.params.id, (err, foundBlog) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            res.render("destroy", { blog: foundBlog });
    });
});

app.post("/blogs/:id/destroy", (req, res) => {
    BlogEntry.findByIdAndDelete(req.params.id, (err) => {
        err ? console.log("SOMETHING WENT WRONG :(") :
            res.redirect("/blogs");
    });
});


app.listen(3000, () => {
    console.log("The Blog Server has started at port 3000.");
});