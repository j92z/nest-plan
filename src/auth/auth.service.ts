import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private jwtService: JwtService
	) { }

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.userRepository.findOne({
			where: {
				username: username
			}
		});
		const isMatch = await bcrypt.compare(pass, user?.password);
		if (user && isMatch) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user: any) {
		const payload = {
			username: user.username,
			id: user.id,
			role: user.role,
			avatar: user.avatar,
			name: user.name
		};
		return {
			accessToken: this.jwtService.sign(payload),
		};
	}
}
