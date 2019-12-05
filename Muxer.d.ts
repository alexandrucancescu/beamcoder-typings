import { DemuxerStream } from "./Demuxer";

export interface MuxerInfo {
	type: "OutputFormat";
	name: string;
	long_name: string;
	mime_type: string;
	extensions: string;
	audio_codec?: string;
	video_codec?: string;
	subtitle_codec?: string;
	flags: {
		[key: string]: any;
	};
	codec_tag: any[];
	priv_class: object;
}

export interface MuxerInfoMap {
	[key: string]: MuxerInfo;
}

export interface MuxerStream {
	codecpar: {
		height?: number;
		width: number;
		format: number; // Pixel format for video , sample format for audio
		channels?: number,
		sample_rate?: number,
		channel_layout?: string,
		block_align?: number, // Should be set for WAV
		bits_per_coded_sample?: number,
		bit_rate?: number;
	};
}

export interface Muxer {
	[key: string]: any;
	newStream(options: {codec_name: string, timebase: number[], interleaved: boolean}): MuxerStream;

	/**
	 * @returns On success, the returned promise resolves to undefined or,
	 * if some of the options could not be set, an object containing an
	 * unset property detailing which of the properties could not be set.
	 */
	openIO(options: {url: string, options: any}): Promise<null>;
}

export function muxers(): MuxerInfoMap;

export function muxer(options: {filename: string}): Muxer;
export function muxer(options: {format_name: string}): Muxer;
export function muxer(options: {oformat: MuxerInfo}): Muxer;
export function muxer(demuxerStream: DemuxerStream): Muxer;
