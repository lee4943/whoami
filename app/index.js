const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");

const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;

const constants = require("./constants");
const {User} = require("./database"); // User model
const session_secret = Math.random().toString(36).substring(2, 15);

app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", __dirname + "/views");

passport.use(new GitHubStrategy({
    clientID: constants.CLIENT_ID,
    clientSecret: constants.CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
    (accessToken, refreshToken, profile, done) => {
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

passport.serializeUser(function(user, done) {
    done(null, user.profileId);
});
  
passport.deserializeUser(function(id, done) {
    User.findOne({
        profileId: id
    }, (err, user) => {
        done(err, user);
    });
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: session_secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/github",
  passport.authenticate("github")
);

app.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/error" }),
  (req, res) => {
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.render("index", { user: req.user});
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get("/error", (req, res) => {
    res.render("error");
});

app.get("/users/:id", (req, res) => {

});

app.put("/users/:id", (req, res) => {

});

console.log(`Running on ${constants.APP_PORT}`);
app.listen(constants.APP_PORT);