import { Plan } from "src/plan/entities/plan.entity";
import { WorkItem } from "src/work-item/entities/work-item.entity";
import { Work } from "src/work/entities/work.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleType } from "../type.d/type";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({
		default: "",
		nullable: false,
		comment: "用户姓名"
	})
	name: string;

	@Column({
		default: "",
		nullable: false,
		comment: "用户名"
	})
	username: string;

	@Column({
		default: "",
		nullable: false,
		comment: "密码"
	})
	password: string;

	@Column({
		default: "",
		nullable: false,
		comment: "头像"
	})
	avatar: string;

	@Column({
		type: "enum",
		enum: RoleType,
		default: RoleType.User,
		nullable: false,
		comment: "角色"
	})
	role: RoleType;

	@OneToMany(() => Plan, plan => plan.user)
	plans: Plan[];

	@OneToMany(() => Work, work => work.user)
	works: Work[];

	@OneToMany(() => WorkItem, workItem => workItem.user)
	workItems: WorkItem[];
}
