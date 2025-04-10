const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js')

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user)
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You Must be Logged in to Explore WanderLust")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not authorized to edit this listing...!")
        return res.redirect(`/listings/${id}/show`)
    }
    next();
}


module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    // console.log(req.body);
    let {error} = reviewSchema.validate(req.body)

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Review you are requesting to delete, Not belonging to you...!")
        return res.redirect(`/listings/${id}/show`)
    }
    next();
}

