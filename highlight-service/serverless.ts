import type { AWS } from "@serverless/typescript";

import { config } from "./config";

import render_status from "@functions/render_status";
import render from "@functions/trigger_render";

const serverlessConfiguration: AWS = {
	service: "highlight-service",
	frameworkVersion: "3",
	plugins: ["serverless-esbuild"],
	provider: {
		architecture: "arm64",
		name: "aws",
		region: config.region,
		runtime: "nodejs14.x",
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		deploymentMethod: "direct",
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
			NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
			REMOTION_APP_REGION: config.region,
			MEDIA_BUCKET: config.mediaBucket,
		},
		iam: {
			role: {
				statements: [
					{
						Effect: "Allow",
						Action: [
							"s3:CreateBucket",
							"s3:ListBucket",
							"s3:PutBucketAcl",
							"s3:GetObject",
							"s3:DeleteObject",
							"s3:PutObjectAcl",
							"s3:PutObject",
							"s3:GetBucketLocation",
						],
						Resource: "arn:aws:s3:::remotionlambda-*",
					},
					{
						Effect: "Allow",
						Action: ["s3:ListAllMyBuckets"],
						Resource: "*",
					},
					{
						Effect: "Allow",
						Action: ["s3:ListBucket", "s3:ListObjects"],
						Resource: `arn:aws:s3:::${config.mediaBucket}`,
					},
					{
						Effect: "Allow",
						Action: ["lambda:ListFunctions"],
						Resource: "*",
					},
					{
						Effect: "Allow",
						Action: [
							"lambda:InvokeFunction",
							"lambda:ListFunctions",
						],
						Resource: `arn:aws:lambda:${config.region}:${config.accountId}:function:remotion-render-*`,
					},
				],
			},
		},
	},
	// import the function via paths
	functions: { render_status, render },
	package: { individually: true },
	custom: {
		esbuild: {
			bundle: true,
			minify: true,
			sourcemap: true,
			exclude: ["aws-sdk"],
			target: "node14",
			define: { "require.resolve": undefined },
			platform: "node",
			concurrency: 10,
		},
	},
};

module.exports = serverlessConfiguration;
