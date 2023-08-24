import dotenv from 'dotenv';
import params from './params.js';

const mode = params.mode; // Development | Production

dotenv.config({
      path: `./.env.${mode}`
});

export default {
      PORT: process.env.PORT,
      MONGO_URL: process.env.MONGO_URL,
      SECRET: process.env.SECRET,
      KEY: process.env.KEY,
      ADMIN: {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
      }
};