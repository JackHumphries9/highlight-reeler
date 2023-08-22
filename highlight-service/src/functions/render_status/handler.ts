import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import {
	getFunctions,
	getRenderProgress,
	getSites,
} from "@remotion/lambda/client";

const status: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	const videoId = event.pathParameters.id;

	const { sites } = await getSites({
		region: process.env.AWS_REGION as any,
	});

	const funcs = await getFunctions({
		region: process.env.AWS_REGION as any,
		compatibleOnly: true,
	});

	const status = await getRenderProgress({
		renderId: videoId,
		bucketName: sites[0].bucketName,
		functionName: funcs[0].functionName,
		region: process.env.AWS_REGION as any,
	});

	console.dir(status);

	if (status.done) {
		return formatJSONResponse({
			message: "Render is done",
			url: status.outputFile,
			percentComplete: 100,
		});
	}

	return formatJSONResponse({
		message: "Rendering...",
		url: status.outputFile,
		estTime: status.timeToFinish,
		percentComplete: status.overallProgress,
		framesRendered: status.framesRendered,
	});
};

export const main = middyfy(status);
