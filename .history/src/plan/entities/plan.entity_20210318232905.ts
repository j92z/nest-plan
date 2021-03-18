import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, TreeChildren, TreeParent, Tree } from 'typeorm';

@Entity()
@Tree("closure-table")
export class Plan {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ default: "", nullable: false, comment: "计划名称" })
	name: string;

	@Column('text')
	content: string

	@Column({ type: "tinyint", unsigned: true, default: 0, comment: "0-未开启 1-开启 2-完成" })
	status: number;

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
}
