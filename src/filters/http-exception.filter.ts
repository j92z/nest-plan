import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		const message = exception.message;
		Logger.log('错误提示', message);
		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;
		const errorResponse = {
			data: {
				error: message,
			}, // 获取全部的错误信息
			message: '请求失败',
			code: status, // 自定义code
			url: request.originalUrl, // 错误的url地址
		};
		// 设置返回的状态码、请求头、发送错误信息
		response.status(HttpStatus.OK);
		response.header('Content-Type', 'application/json; charset=utf-8');
		response.send(errorResponse);
	}
}
