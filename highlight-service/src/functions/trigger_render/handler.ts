import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import {
	getFunctions,
	getSites,
	renderMediaOnLambda,
} from "@remotion/lambda/client";
import { S3 } from "aws-sdk";
import { ListObjectsV2Output } from "aws-sdk/clients/s3";

const s3 = new S3();

const s3ListObjects = async (
	params: S3.ListObjectsV2Request
): Promise<ListObjectsV2Output> => {
	return new Promise((resolve, reject) => {
		s3.listObjectsV2(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

const render: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	const { sites } = await getSites({
		region: "eu-west-2",
	});

	const funcs = await getFunctions({
		region: "eu-west-2",
		compatibleOnly: true,
	});

	// console.log("funcs: ", JSON.stringify(funcs, null, 2));
	// console.log("sites: ", JSON.stringify(sites, null, 2));

	const key = `media/${event.body.s3Folder}/`;
	let videoKeys: string[] = [];

	// Retrieve all the video keys in the folder specified
	const objects = await s3ListObjects({
		Bucket: process.env.MEDIA_BUCKET,
		Prefix: key,
	});

	// Add all the video keys to the array excluding the folder key
	for (const object of objects.Contents) {
		if (object.Key != key) {
			videoKeys.push(object.Key);
		}
	}

	console.log("objects: ", JSON.stringify(objects, null, 2));

	const video = await renderMediaOnLambda({
		region: "eu-west-2",
		codec: "h264",
		composition: "Highlights", // Define which composition we want to render
		functionName: funcs[0].functionName,
		serveUrl: sites[0].serveUrl,
		logLevel: "verbose",
		inputProps: {
			videoKeys,
			date: event.body.date,
			competition: event.body.competition,
		},
	});

	return formatJSONResponse({
		message: `Triggered a render on clips ${event.body.s3Folder}}`,
		url: video.folderInS3Console,
		rId: video.renderId,
	});
};

export const main = middyfy(render);
