import mongoose, { Schema, model, Document } from 'mongoose';

interface Fees {
  fee_id: string;
  fee_currency: string;
  fee_locale: string;
  fee_entity: string;
  fee_entity_property: string;
  fee_type: string;
  fee_value: string;
}

interface feeModelInstance extends mongoose.Model<any> {
  build(attr: Fees): FeesDoc;
}

interface FeesDoc extends Document {
  fee_id: string;
  fee_currency: string;
  fee_locale: string;
  fee_entity: string;
  fee_entity_property: string;
  fee_type: string;
  fee_value: string;
}

const feeSchema = new Schema({
  fee_id: String,
  fee_currency: String,
  fee_locale: String,
  fee_entity: String,
  fee_entity_property: String,
  fee_type: String,
  fee_value: String,
});
feeSchema.statics.build = (attr: Fees) => new Fee(attr);
const Fee = model<any, feeModelInstance>('Fee', feeSchema);

export default Fee;
