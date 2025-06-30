import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
  eliminatedAt?: Date;
}

const CategorySchema: Schema = new Schema(
  {
    nombre: { type: String, required: true },
    impresora: { type: String, required: true },
    eliminatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
