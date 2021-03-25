import { Work } from "src/work/entities/work.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WorkItemStatus } from "../typre.d/type";

@Entity()
export class WorkItem {

	@PrimaryGeneratedColumn("uuid")
	id: string;

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
		type: "enum",
		enum: WorkItemStatus,
		default: WorkItemStatus.Process,
		comment: "日常工作状态"
	})
	status: string;

	@Column({
		type: "text",
		nullable: false,
		comment: "工作完成情况"
	})
	result: string;

	@ManyToOne(() => Work, work => work.workItems)
	work: Work;
}
