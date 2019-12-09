import { DemuxerStream } from "./Demuxer";
import { Packet } from "./Common";

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
	index: number;
	time_base: number[];
	id: number;
	codecpar: {
		type: string;
		codec_type: 'video' | 'audio' | 'subtitle';
		codec_id: number;
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
	type: string;
	oformat: string;
	priv_data: {
		reserve_index_space?: number;
		write_channel_mask?: boolean;
		[key: string]: any;
	};
	streams?: MuxerStream[];
	[key: string]: any;
	newStream(options: {name: string, time_base: number[], interleaved: boolean}): MuxerStream;

	/**
	 * @returns On success, the returned promise resolves to undefined or,
	 * if some of the options could not be set, an object containing an
	 * unset property detailing which of the properties could not be set.
	 */
	openIO(options: {url: string, options?: any}): Promise<null>;

	/**
	 * Write the header to the file. This must be done even for formats that
	 * don't have a header as part of the internal structure as this step also
	 * initializes the internal data structures for writing
	 */
	writeHeader(options: any): Promise<{INIT_IN: 'WRITE_HEADER', unset: any}>;

	/**
	 * In some cases, it is necessary to initialize the structures of the muxer
	 * before writing the header. In this case, call the asynchronous initOutput()
	 * method of the muxer first. This method can also take options to initialise
	 * muxer-specific parameters. Further configure the initialized muxer and then
	 * call writeHeader() before writing any packets or frames
	 */
	initOutput(options: any): Promise<{INIT_IN: string, unset: any}>;

	/**
	 * The method expects a single argument that is either a packet or an options object.
	 * If an options object, provide either a single packet property, or a frame and a
	 * stream_index property
	 */
	writeFrame(packet: Packet): Promise<void>;
	writeFrame(options: {packet: Packet[]}): Promise<void>;
	writeFrame(options: {frame: Packet[], stream_index: number}): Promise<void>;

	/**
	 * The trailer is the end of the file or stream and is written after the muxer
	 * has drained its buffers of all remaining packets and frames.
	 * Writing the trailer also closes the file or stream
	 */
	writeTrailer(): Promise<void>;
}

export function muxers(): MuxerInfoMap;

export function muxer(options: {filename: string}): Muxer;
export function muxer(options: {format_name: string}): Muxer;
export function muxer(options: {oformat: MuxerInfo}): Muxer;
export function muxer(demuxerStream: DemuxerStream): Muxer;
