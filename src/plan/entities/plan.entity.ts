import { Work } from 'src/work/entities/work.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, TreeChildren, TreeParent, Tree, OneToMany } from 'typeorm';
import { PlanStatus } from '../type.d/type';

@Entity()
@Tree("materialized-path")
export class Plan {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ default: "", nullable: false, comment: "计划名称" })
	name: string;

	@Column('text')
	content: string

	@Column({
		type: "enum",
		enum: PlanStatus,
		default: PlanStatus.Process,
		comment: "-1 失败 0-进行中 1-完成"
	})
	status: PlanStatus;

	@Column({ type: "float", unsigned: true, default: 0, precision: 10, scale: 2, comment: "需要时间 单位小时" })
	costTime: number;

	@Column({ default: 0, unsigned: true, comment: "开始时间" })
	startTime: number;

	@Column({ type: "smallint", unsigned: true, default: 0, comment: "排序" })
	sort: number;

	@CreateDateColumn()
	createDate: Date;

	@UpdateDateColumn()
	updateDate: Date;

	@TreeChildren()
	children: Plan[];

	@TreeParent()
	parent: Plan;

	@OneToMany(() => Work, work => work.plan)
	works: Work[];
}


