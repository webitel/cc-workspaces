export interface UserLookupItem {
	id?: string | number;
	name: string;
	username?: string;
	extension: string | number;
	presence: {
		status: string;
	};
	status: string;
}
