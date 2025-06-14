import express from "express";
import { config } from "dotenv";
import { connectDB } from "./db/index.js";
import { createSuperAdmin } from "./db/creator-superadmin.js";
import adminRouter from './routes/admin.route.js';
import transportRouter from './routes/transport.route.js';
import ticketRouter from './routes/ticket.route.js';
config();

const app = express();
const PORT = Number(process.env.PORT);

app.use(express.json());
await connectDB();
await createSuperAdmin();
app.use('/admin', adminRouter);
app.use('/transport', transportRouter);
app.use('/ticket', ticketRouter);

app.listen(PORT, () => console.log(`Server running on port`, PORT));