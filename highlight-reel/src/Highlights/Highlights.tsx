import Title from './Title';
import {ReelerInternalProps} from '../types';
import Clips from './Clips';

export const Highlights = (props: any) => {
	const {videoProps} = props as ReelerInternalProps;

	return (
		<>
			<Title {...props} />
			<Clips videoProps={videoProps} />
		</>
	);
};
