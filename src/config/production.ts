export default {
    // 数据库配置
    database: {
        type: 'mysql',
        host: 'plan-mysql',
        port: 3306,
        username: 'root',
        password: '1qaz123',
        database: 'plan',
        // timezone: 'UTC',
        // charset: 'utf8mb4',
		autoLoadEntities: true,
        synchronize: true,
        // logging: true,
    },
};
