//listing controllers
const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const { category, q } = req.query;
  let filter = {};
  let sort = {};

  // 1. Search Query Handling (Multi-field regex with $or)
  if (q && q.trim() !== "") {
    const regex = new RegExp(q.trim(), "i"); // "i" = case-insensitive
    filter.$or = [
      { title: regex },
      { location: regex },
      { country: regex },
      { categories: regex },
    ];
  }

  // 2. Category Filter Handling
  if (category) {
    if (category === "price") {
      sort = { price: 1 }; // Low to High
    } else {
      filter.categories = category;
    }
  }

  const allListings = await Listing.find(filter).sort(sort);
  res.render("listings/index.ejs", {
    allListings,
    selectedCategory: category,
    searchQuery: q || "",
  });
};

module.exports.renderNewForm = (req, res) => {
  //req.flash("success", "listing created successfully");
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  // Chain .populate("reviews") to fetch the full review data 👇
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

async function geocodeAddress(location, country) {
  let address = `${location}, ${country}`;
  let parts = location
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  let queries = [address];

  // If exact house/plot number is not in map database, progressively search locality and city
  while (parts.length > 1) {
    parts.shift();
    queries.push(`${parts.join(", ")}, ${country}`);
  }
  queries.push(country);

  for (let q of queries) {
    try {
      let geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
        { headers: { "User-Agent": "Wanderlust-App" } },
      );
      let geoData = await geoResponse.json();
      if (geoData && geoData.length > 0) {
        return [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)];
      }
    } catch (err) {
      console.log("Geocoding error:", err);
    }
  }
  return [77.209, 28.6139]; // Default Delhi fallback only if everything fails
}

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  // 1. Geocode location with intelligent locality/city fallback
  let coordinates = await geocodeAddress(
    req.body.listing.location,
    req.body.listing.country,
  );

  // 2. Save listing with geometry coordinates
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = {
    type: "Point",
    coordinates: coordinates,
  };

  await newListing.save();
  req.flash("success", "new listing added");
  res.redirect("/listings");
};

/* module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "new listing added");
  res.redirect("/listings");
}; */

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/e_blur:2000");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "you are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }

  let coordinates = await geocodeAddress(
    req.body.listing.location,
    req.body.listing.country,
  );
  await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
    geometry: { type: "Point", coordinates },
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
};
