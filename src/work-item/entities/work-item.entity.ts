import { Plan } from "src/plan/entities/plan.entity";
import { User } from "src/user/entities/user.entity";
import { Work } from "src/work/entities/work.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WorkItemStatus } from "../typre.d/type";

@Entity()
export class WorkItem {

	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({
		nullable: false,
		default: "",
		comment: "工作名称"
	})
	name: string;

	@Column({
		type: "text",
		nullable: false,
		comment: "工作内容"
	})
	content: string;

	@Column({
		type: "date",
		nullable: false,
		comment: "工作日期"
	})
	date: string;

	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
		default: 0,
		comment: "工作约束开始时间"
	})
	dayWorkStartTime: number;

	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
		default: 0,
		comment: "工作约束结束时间"
	})
	dayWorkEndTime: number;

	@Column({
		type: "enum",
		enum: WorkItemStatus,
		default: WorkItemStatus.Process,
		comment: "日常工作状态"
	})
	status: WorkItemStatus;

	@Column({
		type: "text",
		nullable: false,
		comment: "工作完成情况"
	})
	result: string;

	@Column({
		default: '',
		comment: "级联路径"
	})
	planCascaderPath: string;

	@ManyToOne(() => Work, work => work.workItems)
	work: Work;

	@ManyToOne(() => User, user => user.workItems)
	user: User;

	@ManyToOne(() => Plan, plan => plan.workItems)
	plan: Plan;
}
