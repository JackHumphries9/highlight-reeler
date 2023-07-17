export default {
	type: "object",
	properties: {
		s3Folder: { type: "string" },
		date: { type: "string" },
		competition: { type: "string" },
	},
	required: ["s3Folder", "date", "competition"],
} as const;
