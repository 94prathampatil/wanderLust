const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js")
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js')

const listingsController = require("../controllers/listings.js")
const multer = require('multer') 
const {storage} = require('../cloudConfig.js') 
const upload = multer({ storage })          //store the image in the uploads folder locally 




// index route where all the villahs will be displays using ---> GET REQUEST
// Creating new Entry
router.route("/")
    .get(wrapAsync(listingsController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingsController.createListing));


// New Route
router.get("/new", isLoggedIn, listingsController.rendernewform)

router.get("/:id/show", wrapAsync(listingsController.showListing))

// GET indivisual information about the requested image
// Show Indivisual Entry
// Edit the entry Route
// Update the changes in this route flow will edit.ejs ---> curr route
// Delete Route
router.route("/:id")
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingsController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing))
    
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingsController.renderEditForm))




module.exports = router;