export default {
	type: "object",
	properties: {
		s3Folder: { type: "string" },
		date: { type: "number" },
		competition: { type: "string" },
		homeTeam: { type: "string" },
		awayTeam: { type: "string" },
	},
	required: ["s3Folder", "date", "competition", "homeTeam", "awayTeam"],
} as const;
