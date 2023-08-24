import express from 'express';
import __dirname, {
      authToken
} from './utils.js';
import env from './config/environment/config.js';
import handlebars from 'express-handlebars';
import {
      Server
} from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initPassport from './config/passport/passport.config.js';


import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import sessionsRouter from './routes/sessions.routes.js';
import viewsRouter from './routes/views.routes.js';

import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT;

const httpServer = app.listen(PORT, () => {
      console.log(`Servidor escuchando desde el puerto ${PORT}`);
});

export const io = new Server(httpServer);

app.use(cookieParser());

mongoose.set('strictQuery', false);
const URL = process.env.MONGO_URL;

mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
}).then(() => console.log('Base de datos conectada')).catch(error => console.log(error));

app.use(session({
      store: MongoStore.create({
            mongoUrl: URL,
            mongoOptions: {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
            },
            ttl: 15,
      }),
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
}))


initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({
      extended: true
}));


app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter)
app.use('/api/products', authToken, productsRouter);
app.use('/api/carts', authToken, cartsRouter);
app.use('/api/sessions', sessionsRouter);