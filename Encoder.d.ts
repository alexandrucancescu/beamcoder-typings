import { Frame, Packet } from "./Common";

export interface EncoderInfo {
	readonly type: 'Decoder';
	readonly name: string; // encoder name; ex: 'h264'
	readonly long_name: string; // long encoder name; ex: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10'
	readonly codec_type: 'video'|'audio'|'subtitle';
	readonly id: number;

	// other undocumented info properties
	readonly [key: string]: any;
}

/**
 * Key value object
 * keys are usually the name of the decoder
 */
export interface EncoderInfoMap {
	[key: string]: EncoderInfo;
}

export interface EncodeResult {
	total_time: number; // possibly empty array of packets for further processing
	packets?: Packet[]; // microseconds that the operation took to complete
}

export interface Encoder {
	name: string;
	long_name: string;
	priv_data: {
		preset?: string;
	};

	/**
	 * Encode an uncompressed frame and create a compressed packet
	 */
	encode(frame: Frame | Frame[]): Promise<EncodeResult>;
	encode(...frames: Frame[]): Promise<EncodeResult>;

	/**
	 * Once all frames have been passed to the encoder, it is necessary to call
	 * the asynchronous flush() method. If any packets are yet to be fully encoded
	 * or delivered by the encoder, they will be completed and provided in the
	 * resolved value.
	 */
	flush(): Promise<EncodeResult>;
}

export interface EncoderOptions {
	name?: string;
	codec_id?: string;
	channels?: number;
	sample_rate?: number;
	channel_layout?: string;
	sample_fmt?: string;
	width?: number;
	height?: number;
	bit_rate?: number;
	time_base?: number[];
	framerate?: number[];
	gop_size?: number;
	max_b_frames?: number;
	pix_fmt?: string;
}

export function encoders(): EncoderInfoMap;

export function encoder(options: EncoderOptions): Encoder;
