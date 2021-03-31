export class UpdateWorkItemDto {
	name: string;
	content: string;
	date: string;
	dayWorkStartTime: number;
	dayWorkEndTime: number;
	planId: string;
	workId: string;
	planCascaderPath: string;
}
