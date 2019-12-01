

export interface EncoderInfo{
	readonly type: 'Decoder',
	readonly name: string, //encoder name, ex: 'h264'
	readonly long_name: string, //long encoder name, ex: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10'
	readonly codec_type: 'video'|'audio'|'subtitle',
	readonly id: number,

	//other undocumented info properties
	readonly [key:string]:any
}

/**
 * Key value object
 * keys are usually the name of the decoder
 */
export type EncoderInfoMap={
	[key:string]:EncoderInfo;
}


export interface Encoder{
	priv_data:{
		preset?:string,
	}
}

export function encoders():EncoderInfoMap;

export function encoder({name:string}):Encoder;
export function encoder({codec_id:number}):Encoder;