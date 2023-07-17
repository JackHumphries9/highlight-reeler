import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import { getRenderProgress, getSites } from "@remotion/lambda/client";

const status: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	const videoId = event.pathParameters.id;

	const { sites } = await getSites({
		region: "eu-west-2",
	});

	const status = await getRenderProgress({
		renderId: videoId,
		bucketName: sites[0].bucketName,
		functionName: process.env.REMOTION_APP_FUNCTION_NAME,
		region: "eu-west-2",
	});

	if (status.done) {
		return formatJSONResponse({
			message: "Render is done",
			url: status.outputFile,
		});
	}

	return formatJSONResponse({
		message: "Rendering...",
		url: status.outputFile,
		estTime: status.timeToFinish,
	});
};

export const main = middyfy(status);
