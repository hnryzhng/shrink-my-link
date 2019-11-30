const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const urlSchema = new Schema(
	{
		long_url: String,
		short_url: String
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Urls", urlSchema, "urls");
