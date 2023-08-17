import { ReelerProps } from "../../highlight-types";

export interface VideoProps {
	videoUrl: string;
	durationFrames: number;
}

export interface ReelerInternalProps extends ReelerProps {
    videoProps: VideoProps[];
}