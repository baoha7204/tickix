import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@bhtickix/common";

// An interface that describes the properties that are required to create a new Orders
interface OrderAttrs {
  id?: string;
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}

// An interface that describes the properties that a Orders Document has
export interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}

// An interface that describes the properties that a Orders Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) =>
  new Order({
    _id: attrs.id,
    userId: attrs.userId,
    status: attrs.status,
    price: attrs.price,
    version: attrs.version,
  });

orderSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => Order.findOne({ _id: event.id, version: event.version - 1 });

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
