import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  nombre: string;
  categoriaId: mongoose.Types.ObjectId;
  precio: number;
  createdAt: Date;
  updatedAt: Date;
  eliminatedAt?: Date;
}

const ProductSchema: Schema = new Schema(
  {
    nombre: { type: String, required: true },
    categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    precio: { type: Number, required: true },
    eliminatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;