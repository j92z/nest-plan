import { WorkItemStatus } from "src/work/type.d/type";

export class CreateWorkItemDto {
	name: string;
	content: string;
	date: string;
	dayWorkStartTime: number;
	dayWorkEndTime: number;
	status: WorkItemStatus;
	planCascaderPath: string;
}
