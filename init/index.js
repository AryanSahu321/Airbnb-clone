const path = require("path");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Reliable Google DNS for Atlas SRV resolution

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to MongoDB Atlas DB");
}

const initDB = async () => {
  await main();
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6ac20506f7dee8cc7f13fa99",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized successfully on MongoDB Atlas!");
  process.exit(0);
};

initDB().catch((err) => {
  console.log("Initialization error:", err);
});
