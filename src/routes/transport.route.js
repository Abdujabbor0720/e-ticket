import { Router } from "express";
import { TransportController } from "../controllers/transport.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";

const router = Router();
const controller = new TransportController();

router
   .post('/', controller.createTransport)
   .post('/signin', controller.signInTransport)
   .post('/confirm', controller.confirmSignInTransport)
   .get('/', controller.getAllTransports)
   .get('/:id', controller.getTransportById)
   .patch('/:id', controller.updateTransportById)
   .delete('/:id', controller.deleteTransportById)

export default router;