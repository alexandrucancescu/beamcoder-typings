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
	priv_data: {
		preset?: string;
	};

	/**
	 * Encode an uncompressed frame and create a compressed packet
	 */
	encode(frame: Frame | Frame[]): Promise<Packet>;
	encode(...frames: Frame[]): Promise<Packet>;

	/**
	 * Once all frames have been passed to the encoder, it is necessary to call
	 * the asynchronous flush() method. If any packets are yet to be fully encoded
	 * or delivered by the encoder, they will be completed and provided in the
	 * resolved value.
	 */
	flush(): Promise<Packet>;
}

export function encoders(): EncoderInfoMap;

export function encoder(options: {name: string}): Encoder;
export function encoder(options: {codec_id: number}): Encoder;
