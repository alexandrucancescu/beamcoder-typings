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
	readonly flags: {
		CORRUPT: boolean;
	};
}

/**
 * Packets for decoding can be created without reading them from a demuxer
 */
export function packet(options: {pts: number, dts: number, data: Buffer}): Packet;
