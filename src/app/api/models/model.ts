import { Model, Schema, model, models } from 'mongoose';

interface AdminType {
  publicKey: string;
  fee: number;
  creatorFee: number;
  mintableFee: number;
  updateableFee: number;
  freezeableFee: number;
  password: string;
}

const AdminSchema = new Schema({
  publicKey: {
    type: String,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  creatorFee: {
    type: Number,
    required: true,
  },
  mintableFee: {
    type: Number,
    required: true,
  },
  updateableFee: {
    type: Number,
    required: true,
  },
  freezeableFee: {
    type: Number,
    required: true,
  },
});

export const Admin: Model<AdminType> = models.AdminData || model<AdminType>('AdminData', AdminSchema, 'AdminData');
