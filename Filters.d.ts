import { Frame } from "./Common";

export interface FilterInfo {
	readonly name: string;
	readonly description: string;
	readonly inputs?: any;
	readonly outputs?: any;
	readonly priv_class: {
		readonly type: 'Class';
		readonly class_name: string;
		readonly options?: any
		[key: string]: any;
	};
	readonly flags: {
		readonly DYNAMIC_INPUTS?: boolean;
		readonly DYNAMIC_OUTPUTS?: boolean;
		readonly SLICE_THREADS?: boolean;
		readonly SUPPORT_TIMELINE_GENERIC?: boolean;
		readonly SUPPORT_TIMELINE_INTERNAL?: boolean;
		readonly [key: string]: boolean;
	};
	[key: string]: any;
}

export interface FiltererOptions {
	filterType: 'video'| 'audio' | 'subtitle';
	inputParams: [
		{
			name?: string;
			width?: number;
			height?: number;
			pixelFormat?: string;
			timeBase?: number[];
			pixelAspect?: number[];
			[key: string]: any;
		}
	];
	outputParams: [
		{
			name?: string;
			width?: number;
			height?: number;
			pixelFormat?: string;
			timeBase?: number[];
			pixelAspect?: number[];
			[key: string]: any;
		}
	];
	filterSpec: string;
}

export interface FilterGraph {
	type: string;
	filters: [{
		type: string;
		filter: [Filter];
		name: string;
	}];

	/**
	 * An ascii string represention of the filter graph
	 */
	dump(): string;
}

export interface FilterResult {
	name: string | 'out' | 'in';
	frames: Frame[];
}

export interface Filter {
	/**
	 * The properties of the resolved filterer object
	 */
	graph: FilterGraph;
	filter(toFilter: {name: string, frames: Frame[]}): Promise<FilterResult[]>;
	filter(frames: Frame[]): Promise<FilterResult[]>;
}

/**
 * Key value object
 * keys are usually the name of the filter
 */
export interface FilterInfoMap {
	[key: string]: FilterInfo;
}

/**
 * An object with all the available filters
 */
export function filters(): FilterInfo;

export function filterer(filtererOptions: FiltererOptions): Promise<Filter>;
