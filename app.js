if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')         // Helps to create the styling layout for designing
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session')
const MongoDBStore = require('connect-mongo') 
const flash = require('connect-flash') // For flash messages
const passport = require('passport')
const LocalStrategy = require('passport-local') // For local authentication
const User = require('./models/user.js') // For user authentication
const dbUrl = process.env.ATLASTDB_URL;

// Importing Routers
const listingsRouter = require('./routes/listing.js')
const reviewsRouter = require('./routes/review.js')
const UserRouter = require('./routes/user.js')


main().then((res) => {
    console.log("Database Connected Successfully..!")
}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(dbUrl)
}


// Setting Up EJS
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))    // To make data able to parse which comes from the url
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")));           // To use the public folder for static files like CSS, JS, Images etc

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secrete: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60,
})

store.on("error",  () => {
    console.log("Session Store Error", e)
})

const sessionConfig = {
    store: store,
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// app.get("/", (req, res) => {
//     res.render("listing.ejs")
// })


app.use(session(sessionConfig));
app.use(flash())

// pbkdf2 - Hashing algorithm is user for user password hashing and salting 
app.use(passport.initialize())
app.use(passport.session())
// Use karata ki jevha user eka page varun dusrya page madhe browse karto vevha browser la kalal pahije ki same user browse kartoy...
// Ani jevha user vegveglya api's la request ani response kartoy tyala session mhanto 
// ani pratek veli user login karayala nko pahije mhanun apan session use karto  
passport.use(new LocalStrategy(User.authenticate()))
// Je pn koni navin user yetil tya veli te validate karnyasathi User.authenticate() use karto (User tr apala schemach ahe)

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// serializeUser - store the information releated to user in the session
// deserializeUser - remove the information related to user from the session 



app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
})

// User Authentication Routes
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "prathamesh.patil1@walchandsangli.ac.in",
//         username: "prathamesh-patil",
//     })

//     let registerUser = await User.register(fakeUser, "helloworld")
//     res.send(registerUser)
// })



// Main Listing Route
app.use("/listings", listingsRouter)
// Review Route for Each Listing
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", UserRouter)


// Page not found, 404 error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found...!"))
})

app.use((error, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong...!" } = error;

    res.status(statusCode).render("Error.ejs", { error });
});


app.listen(8080, () => {
    console.log("Server is Running on Port 8080")
})
