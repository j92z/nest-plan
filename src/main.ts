import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { RestfulInterceptor } from './interceptor/restful.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const APP_NAME = process.env.npm_package_name || "api";
	const APP_VERSION = process.env.npm_package_version || "1.0";
	const options = new DocumentBuilder()
		.setTitle(APP_NAME)
		.setDescription(`The ${APP_NAME} API description`)
		.setVersion(APP_VERSION)
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api-doc', app, document);
	// 全局注册拦截器
	app.useGlobalInterceptors(new RestfulInterceptor());
	// 全局注册错误的过滤器
	app.useGlobalFilters(new HttpExceptionFilter());
	await app.listen(3000);
}
bootstrap();
