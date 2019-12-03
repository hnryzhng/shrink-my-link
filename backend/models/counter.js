const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const counterSchema = new Schema(
	{
		universal_counter: {
			type: Boolean,
			default: true
		},
		unique_counter: {
			type: Number,
			default: 0
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Counter", counterSchema, "counter");