import { WorkRepeatType, WorkStatus } from "../type.d/type";


export class UpdateWorkDto {
	name: string;
	content: string;
	status: WorkStatus;
	repeatType: WorkRepeatType;
	repeatStep: number;
	whichDay: number;
	startDate: string;
	endDate: string;
	dayWorkStartTime: number;
	dayWorkEndTime: number;
}
