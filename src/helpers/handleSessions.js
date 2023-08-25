import {
      createHash,
      generateToken,
      validatePassword
} from '../utils.js';

import env from '../config/environment/config.js';

export function execute(operation, data) {

      try {

            const result = operation(data);
            process.send(result);

      } catch (error) {

            process.send({
                  error: error.message
            });

      }

}

export function isAdmin(data) {

      const {
            email,
            password
      } = data;

      const adminPass = process.env.ADMIN_PASSWORD;

      const adminEmail = process.env.ADMIN_EMAIL;

      if (adminEmail !== undefined && adminPass !== undefined) {

            const admin = {

                  first_name: "Admin",
                  last_name: "Coder",
                  email: adminEmail,
                  age: 0,
                  password: createHash(adminPass),
                  role: "admin"

            };

            const validEmail = email === adminEmail;
            const validPassword = validatePassword(password, admin);

            if (validPassword && validEmail) {

                  return admin;

            } else {

                  return false;

            }

      } else {

            return false;

      }

}



export function cfgSession(data) {

      const {
            user,
            req,
            res
      } = data;

      if (user) {

            req.session.userLogged = true;

            req.session.user = user._id;

            const token = generateToken(user);

            if (user.role === "admin") {


                  res.cookie('userData', {
                        id: user._id,
                        first_name: user.first_name,
                        role: user.role,
                        email: user.email,
                        password: createHash(user.password),
                        token: token
                  }, {
                        maxAge: 120000
                  });


            } else {

                  res.cookie('userData', {
                        id: user._id,
                        first_name: user.first_name,
                        role: user.role,
                        email: user.email,
                        token: token
                  }, {
                        maxAge: 900000
                  })

            };

            res.status(200).json({
                  status: "success",
                  message: `Bienvenido ${user.first_name} ${user.last_name}`,
                  token: token
            });


      } else {
            res.status(401).send({
                  status: "error",
                  payload: `Error en el usuario o contraseña`
            });

      };

};

export function cfgSessionGithub(data) {

      const {
            user,
            req,
            res
      } = data;

      if (user) {

            req.session.userLogged = true;
            req.session.user = user._id;

            res.cookie('userData', {
                  id: user._id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  role: user.role,
                  email: user.email,
                  token: generateToken(user)
            });

      } else {

            res.redirect('/login');

      };

};

export function checkSession(req, res, next) {

      if (req.session && req.cookies.userData) {

            next();

      } else {

            console.log("No hay ninguna sesión iniciada");
            res.redirect('/login');

      };

};

export function validateEmail(email) {

      if (/^\w+([\.-]?\w+)*@(?:|hotmail|outlook|gmail|coder)\.(?:|com|es)+$/i.test(email) === false) {
            return true;
      } else {
            return false;
      };
}

export function checkGithubSession(req, res, next) {

      const email = req.cookies.userData.email;

      if (validateEmail(email)) {

            res.redirect('/profile');

      } else {

            next();

      };

};

export function ifSession(req, res, next) {

      if (req.session && req.cookies.userData) {

            res.redirect('/');

      } else {

            next();

      };

};