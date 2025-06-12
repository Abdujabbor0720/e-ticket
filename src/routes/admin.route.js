import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";



const router = Router();
const controller = new AdminController();

router
    .post('/', controller.createAdmin)
    .get('/', controller.getAllAdmins)
    .get('/:id', controller.getAdminsById)
    .patch('/:id', controller.updateAdminsById)
    .delete('/:id', controller.deleteAdminById)



export default router;