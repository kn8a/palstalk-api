const mongoose = require("mongoose")

const friendRequestSchema = mongoose.Schema(
	{
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			require: true,
		},
		to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			require: true,
		},
		status: {
			type: String,
			required: true,
			default: "pending",
			enum: ["pending", "accepted", "declined", "cancelled", "unfriended"],
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("FriendRequest", friendRequestSchema)
