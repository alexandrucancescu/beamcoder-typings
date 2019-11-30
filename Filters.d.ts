


export interface FilterInfo{
	readonly name: string,
	readonly description: string,
	readonly inputs?: any,
	outputs?: any,
	readonly priv_class: {
		readonly type: 'Class',
		readonly class_name: 'abench',
		readonly options: [Object]
	},
	flags: {
			DYNAMIC_INPUTS: false,
			DYNAMIC_OUTPUTS: false,
			SLICE_THREADS: false,
			SUPPORT_TIMELINE_GENERIC: false,
			SUPPORT_TIMELINE_INTERNAL: false
		}
}

/**
 * Key value object
 * keys are usually the name of the filter
 */
export type FilterInfoMap={
	[key:string]:FilterInfo;
}


export function filters():any;