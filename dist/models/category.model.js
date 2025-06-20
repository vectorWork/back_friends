import mongoose, { Schema } from 'mongoose';
var CategorySchema = new Schema({
    nombre: { type: String, required: true },
    eliminatedAt: { type: Date, default: null }
}, { timestamps: true });
export default mongoose.model('Category', CategorySchema);
//# sourceMappingURL=category.model.js.map