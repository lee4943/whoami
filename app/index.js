// express and express-related imports (middleware, templating, etc.)
const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");

// passport imports for GitHub-based auth
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;

// custom imports
const constants = require("./constants");
const {User} = require("./database"); // User model
const session_secret = Math.random().toString(36).substring(2, 15);

// set up templating engine (mustache) for use with '.html' files in 'views' dir
app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", __dirname + "/views");

// use passport with a GitHub auth strategy
passport.use(new GitHubStrategy({
    clientID: constants.CLIENT_ID,
    clientSecret: constants.CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
    (accessToken, refreshToken, profile, done) => {
        // after logging in, if user already exists in DB, continue
        // if not, save new user to DB, and continue
        User.findOne({
            profileId: profile.id
        }, (err, user) => {
            if (user) {
                done(null, user);
            }
            else {
                const newUser = new User({
                    profileId: profile.id,
                    email: profile._json.email || "Unknown",
                    fullName: profile.displayName,
                    description: ""
                });

                newUser.save((err, newUser) => {
                    done(null, newUser);
                });
            }
        });
  }
));

// serialize user's profileId to session
passport.serializeUser(function(user, done) {
    done(null, user.profileId);
});

// deserialize user's profile using profileId
passport.deserializeUser(function(id, done) {
    User.findOne({
        profileId: id
    }, (err, user) => {
        done(err, user);
    });
});

// express middleware binding
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: session_secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// GitHub auth route - redirects user to GitHub to log in
app.get("/auth/github",
  passport.authenticate("github")
);

// GitHub post-auth callback
app.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
});

// main landing page
// page rendering is dictated by if a user is logged in (loggedIn) - see 'index.html'
app.get("/", (req, res) => {
    let loggedIn = req.user ? true : false;
    res.render("index", { user: loggedIn});
});

// passport-based logout, redirect to /
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// returns profileId of logged-in user if logged in, null if not
app.get("/current_user_id",
    (req, res) => {
        if (req.user) {
            res.json({
                profileId: req.user.profileId
            });
        }
        else {
            res.json(null);
        }
});

/*
    checks if user is logged in and if logged-in user's
    profileId matches id param, returns all
    of the logged-in user's info as JSON if so.
    returns 403 if id param does not match logged-in user's profileId
*/
app.get("/users/:id",
    (req, res) => {
    if(req.user && req.params.id == req.user.profileId) {
        User.findOne({
            profileId: req.params.id
        }, (err, user) => {
            res.json(user);
        });
    }
    else {
        res.sendStatus(403);
    }
});

/*
    checks if user is logged in and if logged-in user's profileId matches id param,
    updates logged-in user's 'description' using 'req.body.description' if so.
    returns 403 if id param does not match logged-in user's profileId
*/
app.put("/users/:id",
    (req, res) => {
        if(req.user && req.params.id == req.user.profileId) {
            User.findOneAndUpdate({
                profileId: req.params.id
            }, {
                description: req.body.description
            }, {
                useFindAndModify: false
            }, (err, user) => {
                if (err)
                    console.log(err);
                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(403);
        }
});

console.log(`Running 'whoami' on port ${constants.APP_PORT}`);
app.listen(constants.APP_PORT);

module.exports = app;