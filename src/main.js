import express from "express";
import config from './config/index.js';
import { connectDB } from "./db/index.js";
import { createSuperAdmin } from "./db/creator-superadmin.js";
import adminRouter from './routes/admin.route.js';
import transportRouter from './routes/transport.route.js';
import ticketRouter from './routes/ticket.route.js';
import customerRouter from './routes/customer.route.js'
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());

await connectDB();
await createSuperAdmin();

app.use(cookieParser());

app.use('/admin', adminRouter);
app.use('/transport', transportRouter);
app.use('/ticket', ticketRouter);
app.use('/customer', customerRouter);

app.listen(config.PORT, () => console.log(`Server running on port`, +config.PORT));