import express from "express";
import { config } from "dotenv";
import { connectDB } from "./db/index.js";
import adminRouter from './routes/admin.route.js';
import { createSuperAdmin } from "./db/creator-superadmin.js";

config();

const app = express();
const PORT = Number(process.env.PORT);

app.use(express.json());
await connectDB();
await createSuperAdmin();
app.use('/admin', adminRouter);

app.listen(PORT, () => console.log(`Server running on port`, PORT));