import { Model, Schema, model, models } from 'mongoose';

interface AdminType {
  publicKey: string;
  fee: number;
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
});

export const Admin: Model<AdminType> = models.AdminData || model<AdminType>('AdminData', AdminSchema, 'AdminData');
