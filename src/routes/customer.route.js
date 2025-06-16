import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller.js"

const router = Router();
const controller = new CustomerController();

router
    .post('/signup', controller.signUp)


export default router;