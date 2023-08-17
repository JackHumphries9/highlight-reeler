import React from 'react';
import {ReelerProps} from '../../../highlight-types';
import {
	useCurrentFrame,
	interpolate,
	delayRender,
	staticFile,
	continueRender,
	AbsoluteFill,
	Img,
} from 'remotion';

const background: React.CSSProperties = {
	background:
		'linear-gradient(45deg, rgba(0,3,31,1) 0%, rgba(0,20,85,1) 28%, rgba(38,121,250,1) 76%, rgba(0,212,255,1) 100%)',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	alignItems: 'center',
	zIndex: 5,
};

const bottomLogos: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	marginBottom: 30,
};

const competitionStyle: React.CSSProperties = {
	fontFamily: 'sans-serif',
	fontWeight: 'bold',
	fontSize: 80,
	textAlign: 'center',
	marginTop: 30,
	color: '#f1f1f1',
	textTransform: 'uppercase',
};

const dateStyle: React.CSSProperties = {
	fontFamily: 'sans-serif',
	fontWeight: 'bold',
	fontSize: 42,
	textAlign: 'center',
	marginTop: 30,
	color: '#f1f1f1',
};

const teamsStyle: React.CSSProperties = {
	fontFamily: 'sans-serif',
	fontWeight: 'bold',
	fontSize: 60,

	color: '#f1f1f1',
};
const Title = (props: any) => {
	const {competition, homeTeam, awayTeam, date} = props as ReelerProps;

	const frame = useCurrentFrame();

	const bgOpacity = interpolate(frame, [150, 180], [1, 0]);

	const waitForFont = delayRender();

	const font = new FontFace(
		'Starz',
		`url(${staticFile('/assets/font.ttf')}) format('truetype')`
	);

	font
		.load()
		.then(() => {
			document.fonts.add(font);
			continueRender(waitForFont);
		})
		.catch((err) => console.log('Error loading font', err));

	return (
		<AbsoluteFill style={{opacity: bgOpacity, ...background}}>
			<div>
				<h1 style={competitionStyle}>{competition}</h1>
				<h1 style={dateStyle}>
					{new Date(date).toLocaleDateString('en-GB', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}
				</h1>
			</div>
			<div>
				<h1 style={teamsStyle}>
					{homeTeam} vs {awayTeam}
				</h1>
			</div>
			<div style={bottomLogos}>
				<Img
					src={staticFile('/assets/TheWFA.png')}
					style={{
						objectFit: 'cover',
						width: '100%',
						height: '175px',
						marginRight: '20px',
					}}
				/>
				<Img
					src={staticFile('/assets/AWS.png')}
					style={{
						objectFit: 'cover',
						width: '100%',
						height: '125px',
						marginLeft: '20px',
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};

export default Title;
