import {Composition, delayRender, staticFile, continueRender} from 'remotion';
import {getVideoMetadata} from '@remotion/media-utils';
import {Highlights} from './Highlights/Highlights';
import {ReelerProps} from '../../highlight-types';
import {ReelerInternalProps, VideoProps} from './types';

export const RemotionRoot: React.FC = () => {
	const framerate = 30;
	const initialAnimationDuration = 5;

	return (
		<>
			<Composition
				id="Highlights"
				component={Highlights}
				durationInFrames={300}
				fps={framerate}
				width={1920}
				height={1080}
				defaultProps={{
					videoUrls: [
						'https://jackh.club/thewfa/testhighlight/1.mov',
						'https://jackh.club/thewfa/testhighlight/2.mov',
					],
					date: 1689685765,
					competition: 'Test Competition',
					homeTeam: 'Home Team FC',
					awayTeam: 'Away Team FC',
				}}
				calculateMetadata={async ({props}) => {
					const {videoUrls} = props as unknown as ReelerProps;

					let totalLength = initialAnimationDuration;

					const videoMetadata: VideoProps[] = [];

					for (const url of videoUrls) {
						console.log('Getting metadata for', url);
						console.log(`Total Length duration: ${totalLength}`);
						const data = await getVideoMetadata(url);

						totalLength += data.durationInSeconds;

						videoMetadata.push({
							videoUrl: url,
							durationFrames: Math.floor(data.durationInSeconds * framerate),
						});
					}

					console.log('Total Length duration:', totalLength);
					console.log(
						'Total Length frames:',
						Math.floor(totalLength * framerate)
					);

					return {
						durationInFrames: Math.floor(totalLength * framerate),
						props: {
							...props,
							videoProps: videoMetadata,
						},
					};
				}}
			/>
		</>
	);
};
