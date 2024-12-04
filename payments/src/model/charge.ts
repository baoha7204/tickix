import mongoose from "mongoose";
import { OrderDoc } from "./order";

// An interface that describes the properties that are required to create a new Charges
interface ChargeAttrs {
  stripeId: string;
  order: OrderDoc;
}

// An interface that describes the properties that a Charges Document has
export interface ChargeDoc extends mongoose.Document {
  stripeId: string;
  order: OrderDoc;
}

// An interface that describes the properties that a Charges Model has
interface ChargeModel extends mongoose.Model<ChargeDoc> {
  build(attrs: ChargeAttrs): ChargeDoc;
}

const chargeSchema = new mongoose.Schema(
  {
    stripeId: {
      type: String,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

chargeSchema.statics.build = (attrs: ChargeAttrs) => new Charge(attrs);

const Charge = mongoose.model<ChargeDoc, ChargeModel>("Charge", chargeSchema);

export { Charge };
