import passport from 'passport';
import userModel from '../../dao/models/users.js';
import GitHubStrategy from 'passport-github2';
import env from '../environment/config.js'

const initPassport = () => {

      const cltId = process.env.GITHUB_CLIENT_ID;
      const cltSecret = process.env.GITHUB_CLIENT_SECRET;
      const cltURL = process.env.GITHUB_CLIENT_URL;

      passport.serializeUser((user, done) => {

            done(null, user._id);

      });

      passport.deserializeUser(async (id, done) => {
            try {

                  const user = await userModel.findById(id);

                  done(null, user);

            } catch (error) {

                  done(error);

            };

      });

      passport.use('github', new GitHubStrategy({

            clientID: cltId,
            clientSecret: cltSecret,
            callbackURL: cltURL,

      }, async (accessToken, refreshToken, profile, done) => {
            try {
                  const user = await userModel.findOne({
                        email: profile._json.email
                  });

                  if (user) {
                        return done(null, user);
                  } else {

                        const first_name = profile._json.name.split(' ')[0];
                        const last_name = profile._json.name.split(' ')[1];

                        const newUser = {
                              first_name: first_name ? first_name : 'a',
                              last_name: last_name ? last_name : 'a',
                              age: profile._json.age ? profile._json.age : 0,
                              email: profile._json.email ? profile._json.email : profile._json.login,
                              password: 'a',
                        };

                        let result = await userModel.create(newUser);

                        return done(null, result);
                  };
            } catch (error) {

                  return done(error);

            }

      }));

};

export default initPassport;