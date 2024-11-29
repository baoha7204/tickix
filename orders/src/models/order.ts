import mongoose, { Schema } from "mongoose";

type StatusOrder = "expired" | "paid" | "pending" | "cancelled";

// An interface that describes the properties that are required to create a new Orders
interface OrdersAttrs {
  userId: string;
  status: StatusOrder;
  expiresAt: Date;
  ticketId: string;
}

// An interface that describes the properties that a Orders Document has
interface OrdersDoc extends mongoose.Document {
  userId: string;
  status: StatusOrder;
  expiresAt: Date;
  ticketId: string;
}

// An interface that describes the properties that a Orders Model has
interface OrdersModel extends mongoose.Model<OrdersDoc> {
  build(attrs: OrdersAttrs): OrdersDoc;
}

const ordersSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      required: true,
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

ordersSchema.statics.build = (attrs: OrdersAttrs) => new Orders(attrs);

const Orders = mongoose.model<OrdersDoc, OrdersModel>("Orders", ordersSchema);

export { Orders };
