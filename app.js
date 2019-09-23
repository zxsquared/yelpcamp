// To require everything
var express        = require("express"),
bodyParser         = require("body-parser"), 
mongoose           = require("mongoose"),
flash              = require("connect-flash"),
Campground         = require("./models/campground"),
passport           = require("passport"),
LocalStrategy      = require("passport-local"),
User               = require("./models/user"),
Comment            = require("./models/comment"),
commentRoutes      = require("./routes/comments"),
campgroundRoutes   = require("./routes/campgrounds"),
indexRoutes        = require("./routes/index"),
methodOverride     = require("method-override"),
app = express()



mongoose.connect("mongodb+srv://Magnus-Peters-Munzo:vB0%2412!G!WAi@cluster0-zjiyv.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true})

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}), express.static(__dirname + "/public"))
app.use(flash())

app.use(require("express-session")({
    secret: "YelpCamp is about to be done!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

app.use(indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

app.get("/", function(req, res){
res.render("landing")
})

// TO get server started
app.listen(4005, function(){
    console.log("YelpCamp site on PORT 4005")
})
