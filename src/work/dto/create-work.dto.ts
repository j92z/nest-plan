import { WorkRepeatType, WorkStatus } from "../type.d/type";

export class CreateWorkDto {
	name: string;
	content: string;
	status: WorkStatus;
	repeatType: WorkRepeatType;
	repeatStep: number;
	whichDay: number;
	dayWorkStartTime: number;
	dayWorkEndTime: number;
}
