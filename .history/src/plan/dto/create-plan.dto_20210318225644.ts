export class CreatePlanDto {

	name: string;

	content: string

	status: number;

	costTime: number;

	startTime: number;

	sort: number;

	children: string[];

	parent: string;
}
