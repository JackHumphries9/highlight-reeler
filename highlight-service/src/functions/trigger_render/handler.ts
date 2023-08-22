import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import type { ReelerProps } from "../../../../highlight-types";
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
		region: process.env.AWS_REGION as any,
	});

	const funcs = await getFunctions({
		region: process.env.AWS_REGION as any,
		compatibleOnly: true,
	});

	console.log("funcs: ", JSON.stringify(funcs, null, 2));
	console.log("sites: ", JSON.stringify(sites, null, 2));

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
			videoKeys.push(
				`https://${process.env.MEDIA_BUCKET}.s3.eu-west-2.amazonaws.com/${object.Key}`
			);
		}
	}

	console.log("objects: ", JSON.stringify(objects, null, 2));

	const props: ReelerProps = {
		videoUrls: videoKeys,
		date: event.body.date,
		competition: event.body.competition,
		homeTeam: event.body.homeTeam,
		awayTeam: event.body.awayTeam,
	};

	console.dir(props);

	const video = await renderMediaOnLambda({
		region: process.env.AWS_REGION as any,
		codec: "h264",
		composition: "Highlights", // Define which composition we want to render
		functionName: funcs[0].functionName,
		serveUrl: sites[0].serveUrl,
		logLevel: "verbose",
		inputProps: props as any,
		framesPerLambda: 900, // Attempted to mitigate the timeout error as each lamdba can render each video
	});

	return formatJSONResponse({
		message: `Triggered a render on clips ${event.body.s3Folder}}`,
		url: video.folderInS3Console,
		rId: video.renderId,
	});
};

export const main = middyfy(render);
