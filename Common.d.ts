/// <reference types="node" />
export interface Packet {
	readonly type: 'Packet';
	readonly pts: number; // presentation timestamp; measured in stream timebase
	readonly dts: number; // decode timestamp; measured in stream timebase
	/**
	 * The raw data of the packet
	 * Packet data buffers are shared between C and Javascript so can be written to and modified without having to write the buffer back into the packet
	 */
	data: Buffer;
	readonly size: number; // the size of the raw data
	readonly stream_index: number; // the stream index of the stream this packet belongs to
	readonly flags: {
		readonly KEY: boolean; // Packet represents a key frame
		readonly CORRUPT: boolean; // Corruption detected
		readonly DISCARD: boolean; // Can be dropped after decoding
		readonly TRUSTED: boolean; // Packet from a trusted source
		readonly DISPOSABLE: boolean // Frames that can be discarded by the decoder
	};
	readonly duration: number; // Wrt the stream timebase
	readonly pos: number;
}

export interface Frame {
	type: string;
	linesize: number;
	width: number;
	height: number;
	data: Buffer[];
	readonly flags: {
		CORRUPT?: boolean;
		DISCARD?: boolean;
	};
	nb_samples?: number;
	format?: string;
	key_frame?: boolean;
	pict_type?: string;
	sample_aspect_ratio?: number[];
	pts?: number;
	pkt_dts?: number;
	coded_picture_number?: number;
	display_picture_number?: number;
	quality?: number;
	repeat_pict?: number;
	interlaced_frame?: boolean;
	top_field_first?: boolean;
	palette_has_changed?: boolean;
	reordered_opaque?: any;
	sample_rate?: number;
	channel_layout?: string;
	side_data?: any;
	color_range?: string;
	color_primaries?: string;
	color_trc?: string;
	colorspace?: string;
	chroma_location?: string;
	best_effort_timestamp?: number;
	pkt_pos?: number;
	pkt_duration?: number;
	metadata?: object;
	decode_error_flags?: object;
	channels?: number;
	pkt_size?: number;
	crop_top?: number;
	crop_bottom?: number;
	crop_left?: number;
	crop_right?: number;

	/**
	 * Beam coder exposes some of FFmpeg's ability to calculate the size of data buffers.
	 * If you pass width, height and format properties for video frames, or channels/channel_layout,
	 * sample_rate and format for audio frames, as options to the frame constructor then the linesize
	 * array (number of bytes per line per plane) is computed. For video, multiply each value by the
	 * height to get the minimum buffer size for the plane. For audio, the first element of the array
	 * is the buffer size for each plane.
	 *
	 * To use the linesize numbers to automatically allocate buffers of the correct size,
	 * call alloc() after the factory method
	 */
	alloc(): Frame;
}

/**
 * Packets for decoding can be created without reading them from a demuxer
 */
export function packet(options: {pts: number, dts: number, data: Buffer}): Packet;

/**
 * Create a frame for encoding or filtering
 */
export function frame(options: {pts?: number, width: number, height: number, format: string, data?: Buffer[]}): Frame;

/**
 *  Details of the planes expected for each pixel format
 */
export function pix_fmts(): any[];

export function sample_fmts(): any[];

/**
 * Note that when creating buffers from Javascript,
 * FFmpeg recommends that a small amount of headroom is added to the minimum length of each buffer.
 * The minimum amount of padding is exposed to Javascript as constant
 */
export const AV_INPUT_BUFFER_PADDING_SIZE: number;
