import express from 'express';
import deserializeUser from './middlewares/deserializeUser';
import route from './route';

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(deserializeUser);
  route(app);
  
  return app;
}

export default createServer;
