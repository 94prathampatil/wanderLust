const express = require('express')
const router = express.Router({mergeParams: true}) // To merge the params of the listing and review route
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require('../models/review.js')
const Listing = require("../models/listing.js")
const { isLoggedIn, validateReview, isOwner, isReviewAuthor } = require('../middleware.js')
const reviewsController = require('../controllers/reviews.js')

// Review Route
// Post route creating
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewsController.createReview))


// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, isOwner, wrapAsync(reviewsController.destroyReview))

module.exports = router