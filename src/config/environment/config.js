import dotenv from 'dotenv';
import params from './params.js';

const mode = params.mode; // Dev | Prod

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
      },
      GITHUB: {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }
};