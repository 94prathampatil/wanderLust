const Listing = require("../models/listing.js")

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({})
    // console.log(allListing)
    res.render("listings/index.ejs", {allListing})
}

module.exports.rendernewform = async (req, res) => {
    // console.log(req.user);
    
    res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"},}).populate("owner");
    if (!listing) { 
        req.flash("error", "Listing you are requesting does not exist...!")
        return res.redirect("/listings")
    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing})
}

// Creating new Entry
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;


    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url: url, filename: filename };
    await newListing.save();

    req.flash("success", "New Listing Created Successfully...!")
    // console.log("hwlloe")
    res.redirect("/listings");
}

// Edit the entry Route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    if(!listing) {
        req.flash("error", "Listing you are requesting does not exist...!")
        return res.redirect("/listings")
    }    
    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", {listing, originalImgUrl})
}

// Update the changes in this route flow will edit.ejs ---> curr route
module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url: url, filename: filename };    
        await listing.save();
    }

    req.flash("success", "Listing Updated...!")
    res.redirect(`/listings/${id}/show`)

    // ...req.body.listing  --> deconstruct all the values of the route and separete out it to indivisual values and then update in database at found id collection
}


// Delete Route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted Successfully...!")
    res.redirect("/listings")
}