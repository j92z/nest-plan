import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({default: "", nullable: false, comment: "用户姓名"})
	name: string;

	@Column({default: "", nullable: false, comment: "用户名"})
	username: string;
}
