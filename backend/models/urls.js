const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const urlsSchema = new Schema(
	{
		long_url: String,
		short_url: String
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Urls", urlsSchema, "urls");
