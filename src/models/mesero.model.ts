import mongoose, { Document, Schema } from 'mongoose';

export interface IMesero extends Document {
  name: string;
  codigo: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeseroSchema: Schema = new Schema(
  {
    nombre: { type: String, required: false },
    codigo: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMesero>('Mesero', MeseroSchema);
