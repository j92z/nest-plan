import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlanModule } from './plan/plan.module';
import config from './config/index';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true, // 作用于全局
			load: [config], // 加载自定义配置项
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => configService.get('database', {
				type: 'mysql',
				host: 'localhost',
				port: 3307,
				username: 'root',
				password: '1qaz',
				database: 'nest',
				autoLoadEntities: true,
				synchronize: true,
				logging: true,
			}),
			inject: [ConfigService],
		}),
		// StudentModule,
		PlanModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	constructor(private connection: Connection) { }
}
