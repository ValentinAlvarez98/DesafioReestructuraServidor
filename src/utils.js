import {
      fileURLToPath
} from "url";

import {
      dirname
} from "path";

import bcrypt, {
      genSaltSync
} from 'bcrypt';

import env from './config/environment/config.js';

import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(
      import.meta.url);

const __dirname = dirname(__filename);

const KEY = process.env.KEY;

export const generateToken = (user) => {

      const token = jwt.sign({
            id: user._id,
            email: user.email
      }, KEY, {
            expiresIn: '12h'
      });

      return token;

}

export const authToken = (req, res, next) => {

      try {

            const headerAuth = req.headers.authorization;

            if (!headerAuth) {

                  return res.status(401).send({
                        status: 'error',
                        error: 'No se ha enviado el token de autenticación'
                  });

            };

            const token = headerAuth.split(' ')[1];

            jwt.verify(token, KEY, (error, credentials) => {

                  console.log(error);

                  if (error) return res.status(401).send({
                        status: "error",
                        error: "No está autorizado para acceder a este recurso"
                  })

                  req.user = credentials.user;

                  next();

            });

      } catch (error) {

            throw error;

      };

};


export const createHash = (password) => {

      const salt = bcrypt.genSaltSync(10);

      const hash = bcrypt.hashSync(password, salt);

      return hash;

}

export const validatePassword = (password, user) => {

      const compare = bcrypt.compareSync(password, user.password);

      return compare;

}



export default __dirname;