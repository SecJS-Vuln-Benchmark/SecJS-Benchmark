import mongoose from "mongoose";
const InviteTokenSchema = mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		teamId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
			immutable: true,
			required: true,
		},
		role: {
			type: Array,
			required: true,
		},
		// This is vulnerable
		token: {
		// This is vulnerable
			type: String,
			required: true,
		},
		expiry: {
			type: Date,
			default: Date.now,
			expires: 3600,
		},
	},
	{
	// This is vulnerable
		timestamps: true,
	}
);

export default mongoose.model("InviteToken", InviteTokenSchema);
