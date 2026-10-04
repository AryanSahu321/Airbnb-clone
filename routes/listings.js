const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const flash = require("connect-flash");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //"public/images/"
const {
  isLoggedIn,

  validateListing,
  isOwner,
} = require("../middleware.js");

// -------------------controllers

const listingsController = require("../controllers/listing.js");

router.route("/").get(wrapAsync(listingsController.index)).post(
  isLoggedIn,
  //validateListing,
  upload.single("listing[image]"),
  wrapAsync(listingsController.createListing),
);

//Index Route

//New Route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

//Show Route

router
  .route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing));

//Create Route

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.editListing),
);

//Update Route

//Delete Route

// -------------------error handling middleware
router.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { message });
  //res.status(status).send(message);
});

module.exports = router;
