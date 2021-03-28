import { PlanStatus } from "../type.d/type";

export class CreatePlanDto {
	name: string;
	content: string
	sort: number;
	planCascaderPath: string;
}
