import { RoleType } from "../type.d/type";

export class CreateUserDto {
	name: string;
	username: string;
	password: string;
	avatar: string;
	role: RoleType;
}
