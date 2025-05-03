import express from 'express';
import { login , register ,  googleCallback ,googleLogin  } from '../controleurs/user.js';

const Router = express.Router();

  

Router.post("/login", login);
Router.post("/register", register);
Router.get('/google', googleLogin);                 
Router.get('/home', googleCallback);
export default Router;
