import { Packet } from "./Common";

export interface DemuxerInfo {
	readonly type: 'InputFormat';
	readonly name: string;
	readonly long_name: string;
	readonly mime_type?: string; // Generally not available for demuxers
	readonly extensions: string;
	readonly flags: {
		readonly NOFILE: boolean; // Demuxer will manage IO operations
		readonly NEEDNUMBER: boolean; // Needs '%d' in filename
		readonly SHOW_IDS: boolean; // Show format stream IDs numbers.
		readonly GENERIC_INDEX: boolean; // Use generic index building code
		readonly TS_DISCONT: boolean; // Format allows timestamp discontinuities.
		readonly NOBINSEARCH: boolean; // Format does not allow to fall back on binary search via read_timestamp
		readonly NOGENSEARCH: boolean; // Format does not allow to fall back on generic search
		readonly NO_BYTE_SEEK: boolean; // Format does not allow seeking by byte
		readonly SEEK_TO_PTS: boolean;
		readonly [key: string]: boolean;
	};
	readonly raw_codec_id: number;
	readonly priv_data_size: number;
	readonly priv_class?: any;
	// other undocumented properties
	readonly [key: string]: any;
}

/**
 * Key value object
 * keys are usually the name of the demuxer
 */
export interface DemuxerInfoMap {
	[key: string]: DemuxerInfo;
}

export interface DemuxerSeekOptions {
	/**
	 * The stream where to seek
	 * Use in conjunction with property frame or timestamp
	 */
	stream_index?: number;

	/**
	 * Seek by the number of frames into a given stream
	 * Use in conjunction with stream_index
	 */
	frame?: number;

	/**
	 * Seek forward to a keyframe in a given stream or file at a given timestamp
	 * The timestamp is the presentation timestamp of the packet measured in the timebase of the stream
	 * Use in conjunction with stream_index
	 */
	timestamp?: number;

	/**
	 * seek based on elapsed time from the beginning of the primary stream
	 * (as determined by FFmpeg, normally the first video stream where available)
	 */
	time?: number;

	/**
	 * byte offset position into the file
	 */
	pos?: number;

	/**
	 * The backward Boolean-valued property is interpreted as:
	 *  true:  find the nearest key frame before the timestamp
	 *  false: find the nearest keyframe after the timestamp
	 */
	backward?: boolean;
	/**
	 * The any Boolean-valued property enables seeking to both key and non-key frames
	 */
	any?: boolean;
}

export interface DemuxerStream {
	readonly type: 'Stream';
	readonly index: number; // index of the stream in the demuxer
	readonly id: number;
	readonly time_base: number[];
	readonly sample_aspect_ratio: number[];
	readonly codecpar: {
		readonly type: 'CodecParameters';
		readonly codec_type: string; // video | audio | subtitles
		readonly codec_id: number;
		readonly name: number;
		readonly codec_tag: number;
		readonly format: string; // pixel format
		readonly width: number;
		readonly height: number;

		// other undocumented properties
		readonly [key: string]: any;
	};
	// other undocumented properties
	readonly [key: string]: any;
}

export interface Demuxer {
	readonly type: "demuxer";
	readonly iformat: {
		readonly type: 'InputFormat';
		readonly name: string;
		readonly [key: string]: any;
	};
	readonly ctx_flags: {
		readonly NOHEADER: boolean;
		readonly UNSEEKABLE: boolean
		readonly [key: string]: boolean;
	};
	readonly streams: ReadonlyArray<DemuxerStream>;
	readonly url?: string;
	readonly start_time: number;
	readonly duration: number; // The duration property is measured in microseconds (AV_TIME_BASE)
	readonly bit_rate: number;

	/**
	 * Not yet documented in the original package
	 */
	stream(): any; // TODO

	/**
	 * Beam coder offers FFmpeg's many options for seeking a particular frame in a file,
	 * either by time reference, frame count or file position.
	 * To do this, use the seek method of a demuxer-type object with
	 * an options object to configure the operation.
	 * https://github.com/Streampunk/beamcoder#seeking
	 */

	seek(options: DemuxerSeekOptions): Promise<null>;

	/**
	 * Demuxes a packet and returns it
	 */
	read(): Promise<Packet>;

	// can have many other properties that are not documented
	readonly [key: string]: any;
}

export interface DemuxerArgumentOptions {
	iformat?: DemuxerInfo;
	url?: string;
	options?: {
		video_size?: string;
		pixel_format?: string;
		sample_rate?: number;
		channels?: number;
		packetsize?: number;
	};
}

export interface WritableDemuxerStreamSource extends NodeJS.WritableStream {
	/**
	 * Create a demuxer from this source
	 */
	demuxer(options: DemuxerArgumentOptions): Promise<Demuxer>;
}

export function demuxer(options: DemuxerArgumentOptions): Promise<Demuxer>;
export function demuxer(url: string): Promise<Demuxer>;

/**
 * @returns a object with details of all the available demuxer input formats
 */
export function demuxers(): DemuxerInfoMap;

/**
 * Beam coder offers a Node.js Writable stream interface to a demuxer, allowing source data to be streamed to the demuxer from a file or other stream source such as a network connection.
 * @param options.highwaterMark: threshold
 */
export function demuxerStream(options: {highwaterMark: number}): WritableDemuxerStreamSource;
