import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller.js"

const router = Router();
const controller = new CustomerController();

router
    .post('/signup', controller.signUp)
    .post('/signin', controller.signIn)
    .post('/confirm-signin', controller.confirmSignIn)
    .post('/token', controller.newAccessToken)
    .post('/logout', controller.logOut)


export default router;