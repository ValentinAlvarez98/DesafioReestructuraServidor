import {
      Router
} from 'express';
import passport from 'passport';

import {
      createHash,
      authToken,
      validatePassword
} from '../utils.js';

import {
      fork
} from 'child_process';

import UsersManager from '../dao/dbManagers/users.js';

import {
      handleTryErrorDB,
      validateData,
      validateFields,
      phoneOptions
} from '../helpers/handleErrors.js';
import {
      cfgSession,
      cfgSessionGithub,
      checkSession,
      isAdmin,
      validateEmail,
      execute
} from '../helpers/handleSessions.js';

const usersManager = new UsersManager();

const sessionsRouter = Router();


sessionsRouter.post('/login', async (req, res) => {

      try {

            const {
                  email,
                  password
            } = req.body;

            const isValid = validateFields(req.body, ['email', 'password']);

            validateData(!isValid, res, "Faltan campos obligatorios");

            const adminData = {
                  ...req.body,
            }

            let user = isAdmin(adminData);

            if (!user) {

                  user = await usersManager.loginUser(req.body);

                  validateData(!user, res, "Error en el usuario o contraseña");

            }

            const isValidPassword = validatePassword(password, user);

            validateData(!isValidPassword, res, "Contraseña incorrecta");

            const data = {
                  user,
                  req,
                  res
            };

            execute(cfgSession, data);


      } catch (error) {

            handleTryErrorDB(error);

      };

});

sessionsRouter.get('/github', passport.authenticate('github', {
      scope: ['user:email']
}), async (req, res) => {

      try {

            res.status(200).json({
                  status: "success",
                  message: "Redireccionando a GitHub"
            });


      } catch (error) {

            handleTryErrorDB(error);

      };

});

sessionsRouter.get('/githubcallback', passport.authenticate('github', {
      failureRedirect: '/login'
}), async (req, res) => {

      try {

            const user = req.user;

            const data = {
                  user,
                  req,
                  res
            };

            execute(cfgSessionGithub, data);

            res.redirect('/profile')

      } catch (error) {

            handleTryErrorDB(error);

      };

});

sessionsRouter.get('/githubToken', async (req, res) => {

      try {

            const token = req.cookies.userData.token;

            res.status(200).json({
                  status: "success",
                  message: "Token obtenido correctamente",
                  token: token
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});

sessionsRouter.post('/register', async (req, res) => {

      try {

            const {
                  first_name,
                  last_name,
                  email,
                  age,
                  password,
                  confirmed_password
            } = req.body;

            const isValid = true;

            for (const field of ['first_name', 'last_name', 'email', 'age', 'password', 'confirmed_password']) {
                  if (!req.body[field]) {
                        isValid = false;
                        break;
                  }
            }

            validateData(!isValid, res, "Faltan campos obligatorios");

            validateData(password !== confirmed_password, res, "Las contraseñas ingresadas, no coinciden");

            const newUser = {
                  first_name,
                  last_name,
                  email,
                  age,
                  password: createHash(password),
            };

            const result = await usersManager.registerUser(newUser);

            validateData(!result, res, "El usuario ya está registrado");

            res.send({
                  status: "success",
                  payload: `El usuario ${newUser.first_name} ${newUser.last_name} se ha creado correctamente`
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});

sessionsRouter.post('/logout', async (req, res) => {

      try {

            res.clearCookie('userData');
            req.session.destroy((err) => {
                  if (err) {
                        console.log(err);
                  };
            });

            res.redirect('/login');

      } catch (error) {

            handleTryErrorDB(error);

      };

});

sessionsRouter.post('/profile', authToken, async (req, res) => {

      try {
            const {
                  first_name,
                  last_name,
                  email,
                  phone,
            } = req.body;

            const userData = req.cookies.userData;

            const id = userData.id;

            const isValid = validateFields(req.body, ['first_name', 'last_name', 'email']);

            validateData(!isValid, res, "Faltan campos obligatorios");

            const user = await usersManager.getUser(email, id);

            validateData(!user, res, "El usuario no existe");

            const newPhone = phoneOptions(user.phone, phone);

            const hashedPassword = createHash(user.password);

            const userToUpdate = {
                  ...req.body,
                  phone: newPhone,
                  role: user.role,
                  password: hashedPassword,
            };

            const result = await usersManager.updateUser(user.email, userToUpdate);

            validateData(!result, res, "No se pudo actualizar el usuario");

            const userUpdated = await usersManager.getUser(userToUpdate.email, null);

            const data = {
                  user: userUpdated,
                  req,
                  res
            }

            execute(cfgSession, data);

      } catch (error) {

            handleTryErrorDB(error);

      };

});

sessionsRouter.get('/delete', authToken, async (req, res) => {

      try {

            const userData = req.cookies.userData;

            const email = userData.email;

            const result = await usersManager.deleteUser(email);

            validateData(!result, res, "No se pudo eliminar el usuario");

            res.clearCookie('userData');

            req.session.destroy((err) => {
                  if (err) {
                        console.log(err);
                  }
            });

            res.json({
                  status: "success",
                  payload: `El usuario ${userData.email} se ha eliminado correctamente`
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});



export default sessionsRouter;