import React from 'react';
import {Series, OffthreadVideo} from 'remotion';
import {VideoProps} from '../types';

interface ClipsProps {
	videoProps: VideoProps[];
}

const videoStyle: React.CSSProperties = {
	zIndex: -1,
};

const Clips = (props: any) => {
	const {videoProps} = props as ClipsProps;

	React.useEffect(() => {
		console.log(videoProps);
	}, []);

	return (
		<Series>
			{videoProps.map((video, i) => {
				let offset = 0;

				if (i === 0) {
					offset = 150;
				}

				return (
					<Series.Sequence
						key={video.videoUrl}
						offset={offset}
						durationInFrames={video.durationFrames}
					>
						<OffthreadVideo style={videoStyle} src={video.videoUrl} />
					</Series.Sequence>
				);
			})}
		</Series>
	);
};

export default Clips;
