const User = require("../models/user")

module.exports.renderSignup = (req, res) => { 
    res.render("users/signup.ejs")
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body
        const newUser = new User({
            email: email,
            username: username,
        })

    let registerUser = await User.register(newUser, password);
    // console.log(registerUser)
    req.login(registerUser, (err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Welcome to Wanderlust!")
        res.redirect("/listings")
    })
    }
    catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust....!")
    res.redirect(res.locals.redirectUrl || "/listings") 
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err)
        }
        req.flash("success", "User Logout Successfully...!")
        res.redirect("/listings")
    })
}