import { PlanStatus } from "../type.d/type";

export class CreatePlanDto {

	name: string;

	content: string

	status: PlanStatus;

	costTime: number;

	sort: number;

	parent: string;

	planCascaderPath: string;
}
