// source ~/.bash_profile
const path = require('path');
const PORT = process.env.PORT || 3000;


var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    sanitizer = require("express-sanitizer"), //It clears the HTML input for script inyection
    mongoose = require("mongoose"),
    express = require("express"),
    //ENVIROMENT VARIABLE
    // process.ENV.<VARIABLE_NAME> || <DEFAULT_VALUE>
    // This URL connects to the MongoDB Atals Cloud Database (Production Enviroments)
    mongoDB = 'mongodb+srv://hector:mongo123@cluster0-4ni8f.mongodb.net/test?retryWrites=true&w=majority',
    // This URL connects locally to MongoDB to (Developer Debugging Enviroment)
    // mongoDB = 'mongodb://localhost/blog_app';
    app = express();

// APP CONFIGURATION
app.use(methodOverride("_method"));
app.use(sanitizer());
app.use(express.static(path.join(__dirname, 'assets')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch(err => {
    console.log("Error: ", err);
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


app.listen(PORT, () => console.log(`Listening on ${PORT}`))

// STEPS TO FOLLOW
/*

    1. Initialize 'package.json'
        > npm init

    2. In 'package.json" add in 'scripts' ->  "start": "node app.js"

    3. Initialize git
        > git init
        > git add .
        > git commit -m "COMMIT NAME"

    4. Initialize Heroku
        > heroku login -i

    4. Create Heroku app
        > heroku create <APP_NAME>

    5. Add heroku to Git Repo
        > heroku git:remote -a <APP_NAME>

    6. Push project to Heroku Server
        > git push heroku master


    To verify the modules installed remotely in the server we use
        > heroku run ls node_modules (for DB we need mongodb & mongoose)

*/