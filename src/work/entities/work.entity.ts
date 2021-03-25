import { Plan } from "src/plan/entities/plan.entity";
import { WorkItem } from "src/work-item/entities/work-item.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkRepeatType, WorkStatus } from "../type.d/type";


@Entity()
export class Work {
	@PrimaryGeneratedColumn('uuid')
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
		type: "enum",
		enum: WorkStatus,
		default: WorkStatus.Process,
		comment: "工作状态"
	})
	status: WorkStatus;

	@Column({
		type: "enum",
		enum: WorkRepeatType,
		default: WorkRepeatType.Day,
		comment: "重复类型"
	})
	repeatType: WorkRepeatType;

	@Column({
		type: "tinyint",
		unsigned: true,
		default: 1,
		comment: "重复间隔步长"
	})
	repeatStep: number;

	@Column({
		type: "tinyint",
		nullable: false,
		default: 1,
		comment: "重复周期内哪天开始"
	})
	whichDay: number;

	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
		default: 1,
		comment: "工作约束开始时间"
	})
	dayWorkStartTime: number;

	@Column({
		type: "int",
		unsigned: true,
		nullable: false,
		default: 86399,
		comment: "工作约束结束时间"
	})
	dayWorkEndTime: number;

	@Column({
		type: "date",
		nullable: false,
		comment: "开始日期"
	})
	startDate: string;

	@Column({
		type: "date",
		nullable: false,
		comment: "开始日期"
	})
	endDate: string;

	@ManyToOne(() => Plan, plan => plan.works)
	plan: Plan;

	@OneToMany(() => WorkItem, workItems => workItems.work)
	workItems: WorkItem[];
}
