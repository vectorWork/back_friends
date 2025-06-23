import mongoose, { Document, Schema } from 'mongoose';
import { IComanda } from './comanda.model';
import { IProduct } from './product.model';

export interface IProductoComanda extends Document {
  idComanda: mongoose.Types.ObjectId;
  idProducto: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductoComandaSchema: Schema = new Schema(
  {
    idComanda: {
      type: Schema.Types.ObjectId,
      ref: 'Comanda',
      required: true,
    },
    idProducto: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

const ProductoComanda = mongoose.model<IProductoComanda>('ProductoComanda', ProductoComandaSchema);

export default ProductoComanda;