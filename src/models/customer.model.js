import { Schema, model } from "mongoose"

const CustomerSchema = new Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, unique: true, required: true, },
    email: { type: String, unique: true, required: true }
}, {
    timestamps: true
});

const Customer = model('Customer', CustomerSchema);
export default Customer;