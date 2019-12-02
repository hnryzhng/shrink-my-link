const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const urlSchema = new Schema(
	{
		doc_id: {
			type: String
		},
		long_url: {
			type: String
		},
		short_url: { 
			type: String 
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Urls", urlSchema, "urls");
