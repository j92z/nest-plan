import developmentConfig from './development';
import productionConfig from './production';

const configs = {
    development: developmentConfig,
    production: productionConfig,
};
const env = process.env.NODE_ENV || 'development';

export default () => configs[env];
