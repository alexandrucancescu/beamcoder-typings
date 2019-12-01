import { Demuxer } from "./Demuxer";
import { Frame, Packet } from "./Common";

export interface DecoderInfo {
	readonly type: 'Codec';
	readonly name: string; // decoder name; ex: 'h264'
	readonly long_name: string; // long decoder name; ex: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10'
	readonly codec_type: 'video'|'audio'|'subtitle';
	readonly id: number;

	// other undocumented info properties
	readonly [key: string]: any;
}

/**
 * Key value object
 * keys are usually the name of the decoder
 */
export interface DecoderInfoMap {
	[key: string]: DecoderInfo;
}

export interface DecodeResult {
	/**
	 * An array of decoded frames {@interface Frame} that are now available.
	 * If the array is empty, the decoder has buffered the packet
	 * as part of the process of producing future frames.
	 * Frames are delivered in presentation order
	 */
	readonly frames: Frame[];
	/**
	 * Microseconds that the operation took to complete
	 */
	readonly total_time: number;
}

export interface Decoder extends OptionalDecoderInfo {
	type: 'decoder';
	codec_id: number;
	name: string;
	readonly long_name: string;
	readonly codec_tag: string;
	pix_fmt?: string;
	height?: number;
	width?: number;
	priv_data: any;
	/**
	 *  Decode an encoded data packet/packets {@interface Packet} and create an uncompressed frame (may be a frames-worth of audio).
	 *  Decoders may need more than one packet to produce a frame and may subsequently produce more than one frame per packet.
	 *  This is particularly the case for long-GOP formats.
	 */
	decode(packet: Packet | Packet[]): Promise<DecodeResult>;
	decode(...packets: Packet[]): Promise<DecodeResult>;

	/**
	 * Once all packets have been passed to the decoder, it is necessary to call its asynchronous flush() method.
	 * If any frames are yet to be delivered by the decoder, they will be provided in the resolved value.
	 *
	 * Call the flush operation once and do not use the decoder for further decoding once it has been flushed.
	 * The resources held by the decoder will be cleaned up as part of the Javascript garbage collection process, so make sure that the reference to the decoder goes out of scope.
	 */

	flush(): Promise<DecodeResult>;

	/**
	 * Undocumented
	 */
	useParams(...args: any[]): any;

	/**
	 * Undocumented
	 */
	extractParams(...args: any[]): any;

	/**
	 * A decoder has many properties.
	 * These can be set before decoding in the usual way for a Javascript object.
	 * Some of the properties are more appropriate for encoding but are presentfor information.
	 * Some properties can only be set by libav*, others can only be set by the user,some both.
	 * @see {@link http://ffmpeg.org/doxygen/4.1/structAVCodecContext.html}
	 * AVCodecContext FFmpeg documentation for details.
	 */
	[key: string]: any;
}

/**
 * @returns a object with details of all the available decoders
 */
export function decoders(): DecoderInfoMap;

/**
 * Create a decoder by name - note this is synchronous
 */
export function decoder(options: {name: string, width?: number, height?: number}): Decoder;

/**
 * Create a decoder by codec_id - note this is synchronous
 */
export function decoder(options: {codec_id: number, width?: number, height?: number}): Decoder;

/**
 * Alternatively, use a demuxer and a stream_index
 * The codec parameters of the streams will be used to set the decoding parameters
 */
export function decoder(options: { demuxer: Demuxer, stream_index: number }): Decoder;

interface OptionalDecoderInfo {
	bit_rate?: any;
	flags?: any;
	flags2?: any;
	extradata?: any;
	time_base?: any;
	ticks_per_frame?: any;
	delay?: any;
	coded_width?: any;
	coded_height?: any;
	has_b_frames?: any;
	slice_offset?: any;
	sample_aspect_ratio?: any;
	slice_flags?: any;
	intra_matrix?: any;
	inter_matrix?: any;
	intra_dc_precision?: any;
	skip_top?: any;
	skip_bottom?: any;
	refs?: any;
	color_primaries?: any;
	color_trc?: any;
	colorspace?: any;
	color_range?: any;
	chroma_sample_location?: any;
	field_order?: any;
	sample_rate?: any;
	channels?: any;
	sample_fmt?: any;
	frame_size?: any;
	frame_number?: any;
	cutoff?: any;
	channel_layout?: any;
	request_channel_layout?: any;
	request_sample_fmt?: any;
	rc_max_rate?: any;
	workaround_bugs?: any;
	strict_std_compliance?: any;
	error_concealment?: any;
	debug?: any;
	err_recognition?: any;
	reordered_opaque?: any;
	idct_algo?: any;
	bits_per_coded_sample?: any;
	bits_per_raw_sample?: any;
	thread_count?: any;
	thread_type?: any;
	active_thread_type?: any;
	thread_safe_callbacks?: any;
	profile?: any;
	level?: any;
	skip_loop_filter?: any;
	skip_idct?: any;
	skip_frame?: any;
	subtitle_header?: any;
	framerate?: any;
	sw_pix_fmt?: any;
	pkt_timebase?: any;
	codec_descriptor?: any;
	sub_charenc?: any;
	sub_charenc_mode?: any;
	skip_alpha?: any;
	dump_separator?: any;
	codec_whitelist?: any;
	properties?: any;
	sub_text_format?: any;
	trailing_padding?: any;
	max_pixels?: any;
	hwaccel_flags?: any;
	apply_cropping?: any;
	extra_hw_frames?: any;
}

export {};
