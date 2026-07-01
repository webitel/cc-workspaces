export interface UserLookupItem {
	id?: string | number;
	name: string;
	extension: string | number;
	presence: {
		status: string;
	};
	status: string;
}
