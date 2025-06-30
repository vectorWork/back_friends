import { Document, Schema, model } from 'mongoose';

export interface IComanda extends Document {
  createdAt: Date;
  updatedAt: Date;
  codigo: string;
  mesero: string;
  mesa: string;
}

const ComandaSchema = new Schema<IComanda>(
  {
    codigo: { type: String, required: true, unique: true },
    mesero: { type: String, required: true },
    mesa: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comanda = model<IComanda>('Comanda', ComandaSchema);
