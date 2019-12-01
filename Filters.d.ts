export interface FilterInfo {
	readonly name: string;
	readonly description: string;
	readonly inputs?: any;
	readonly outputs?: any;
	readonly priv_class: {
		readonly type: 'Class';
		readonly class_name: string;
		readonly options?: any
	};
	readonly flags: {
		readonly DYNAMIC_INPUTS: boolean;
		readonly DYNAMIC_OUTPUTS: boolean;
		readonly SLICE_THREADS: boolean;
		readonly SUPPORT_TIMELINE_GENERIC: boolean;
		readonly SUPPORT_TIMELINE_INTERNAL: boolean;
	};
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
