export default {
    // 数据库配置
    database: {
        type: 'mysql',
        host: 'localhost',
        port: 3307,
        username: 'root',
        password: '1qaz',
        database: 'plan',
        // timezone: 'UTC',
        // charset: 'utf8mb4',
		autoLoadEntities: true,
        synchronize: true,
        // logging: true,
    },
};
