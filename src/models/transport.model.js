import { Schema, model } from "mongoose";

const transportSchema = new Schema({
    transportType: { type: String, required: true },
    transportNumber: { type: String, required: true },
    class: { type: String, required: true },
    seat: { type: String, required: true }
}, {
    timestamps: true,
    toJSON: { virtual: true },
    toObject: { virtual: true }
});

transportSchema.virtual('tickets', {
    ref: 'Ticket',
    localField: '_id',
    foreignField: 'transportId'
});

const Transport = model('Transport', transportSchema);
export default Transport;