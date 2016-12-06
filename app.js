var express          = require('express'),
    app              = express(),
    bodyParser       = require('body-parser'),
    mongoose         = require('mongoose'),
    passport         = require('passport'),
    flash            = require('connect-flash'),
    LocalStrategy    = require('passport-local'),
    methodOverride   = require('method-override'),
    Campground       = require('./models/campground'),
    Comment          = require('./models/comments'),
    User             = require('./models/user'),
    seedDB           = require('./seeds.js');

var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var authRoutes = require('./routes/index');


//mongoose.connect('mongodb://localhost/yelp_camp');
mongoose.connect('mongodb://smafair:stormof59@ds127958.mlab.com:27958/gocamp');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());
//seedDB();

// Passport Configuration
app.use(require('express-session')({
    secret: 'The secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

// Requiring Routes
app.use('/', authRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp has started");
});