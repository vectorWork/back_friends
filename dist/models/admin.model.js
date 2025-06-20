import mongoose, { Schema } from 'mongoose';
var AdminSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model('Admin', AdminSchema);
//# sourceMappingURL=admin.model.js.map