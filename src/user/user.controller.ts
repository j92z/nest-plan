import { Controller, Post, Body, Patch, Param, Request, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleType } from './type.d/type';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService
	) { }

	@Post('register')
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/info/:id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(id, updateUserDto);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/role/:id')
	fixRole(@Param('id') id: string, @Body('role') role: RoleType) {
		return this.userService.updateRole(id, role);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/password/:id')
	fixPassword(@Param('id') id: string, @Body('password') password: string) {
		return this.userService.updatePassword(id, password);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}
}
