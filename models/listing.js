const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  /* image: {
    filename: { type: String, default: "listingimage" },
    url: {
      type: String,
      required: true,
      default:
        "https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) =>
        v === "" || v === "null" || v === null
          ? "https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          : v,
    },
  } */
  image: {
    url: String,
    filename: String,
  },

  price: {
    type: Number,
    required: true,
  },
  location: String,
  country: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  categories: [
    {
      type: String,
      enum: [
        "trending",
        "rooms",
        "location",
        "price",
        "reviews",
        "iconic cities",
        "amazing pools",
        "mountain",
        "snow",
        "tree",
        "castle",
        "farms",
      ],
      default: "trending",
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing && listing.reviews && listing.reviews.length) {
    let res = await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log(res);
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
