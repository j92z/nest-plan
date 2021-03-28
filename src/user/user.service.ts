import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RoleType } from './type.d/type';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) { }

	async create(createUserDto: CreateUserDto) {
		const userCount = await this.userRepository.count({
			where: {
				username: createUserDto.username
			}
		});
		if (userCount > 0) {
			throw new HttpException("当前用户名不可使用", HttpStatus.BAD_REQUEST);
		}
		const user = this.userRepository.create(createUserDto);
		const genSalt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, genSalt);
		const userInfo = await this.userRepository.save(user);
		const { password, ...result } = userInfo;
		return result;
	}

	async findByUsernameAndPassword(loginUserDto: LoginUserDto) {
		const user = await this.userRepository.findOne({
			where: {
				username: loginUserDto.username
			}
		});
		if (!user) {
			throw new HttpException("用户名密码错误", HttpStatus.BAD_REQUEST);
		}
		const isMatch = await bcrypt.compare(loginUserDto.password.toString(), user.password);
		if (!isMatch) {
			throw new HttpException("用户名密码错误", HttpStatus.BAD_REQUEST);
		}
		const { password, ...result } = user;
		return result;
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.userRepository.findOne(id);
		user.name = updateUserDto.name;
		user.avatar = updateUserDto.avatar;
		return this.userRepository.update(id, user);
	}

	async updateRole(id: string, role: RoleType) {
		const user = await this.userRepository.findOne(id);
		user.role = role;
		return this.userRepository.update(id, user);
	}

	async updatePassword(id: string, password: string) {
		const user = await this.userRepository.findOne(id);
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		return this.userRepository.update(id, user);
	}

}
