const Review = require('../models/review.js')
const Listing = require("../models/listing.js")

module.exports.createReview = async (req, res) => {

    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id)

    // Create new review
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    listing.reviews.push(newReview)
    console.log(newReview)
    await newReview.save();
    await listing.save();

    // console.log("New review Saved")
    // res.send("New Review Saved")

    res.redirect(`/listings/${listing._id}/show`)
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})       // $pull is used to remove the occurance of the existing element from the array
    await Review.findByIdAndDelete(reviewId)

    res.redirect(`/listings/${id}/show`)

}