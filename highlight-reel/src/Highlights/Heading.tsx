import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

const title: React.CSSProperties = {
	fontFamily: 'Starz',
	fontWeight: 'bold',
	fontSize: 100,
	textAlign: 'center',
	position: 'absolute',
	bottom: 160,
	width: '100%',
};

const word: React.CSSProperties = {
	marginLeft: 10,
	marginRight: 10,
	display: 'inline-block',
};

export const Heading: React.FC<{
	text: string;
}> = ({text}) => {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();

	const words = text.split(' ');

	return (
		<h1 style={title}>
			{words.map((t, i) => {
				const delay = i * 5;

				const scale = spring({
					fps: videoConfig.fps,
					frame: frame - delay,
					config: {
						damping: 200,
					},
				});

				return (
					<span
						key={t}
						style={{
							...word,
							transform: `scale(${scale})`,
						}}
					>
						{t}
					</span>
				);
			})}
		</h1>
	);
};
