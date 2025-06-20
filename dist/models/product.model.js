import mongoose, { Schema } from 'mongoose';
var ProductSchema = new Schema({
    nombre: { type: String, required: true },
    categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    precio: { type: Number, required: true },
    eliminatedAt: { type: Date, default: null },
}, { timestamps: true });
var Product = mongoose.model('Product', ProductSchema);
export default Product;
//# sourceMappingURL=product.model.js.map