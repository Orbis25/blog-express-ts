import { STATE } from "../enums/State.enum";
import { Document, Schema } from "mongoose";

export class BaseModel extends Document {
  _id!: string;
  createdAt = new Date();
  updatedAt = new Date();
  state = STATE.ACTIVE;
}

export class BaseSchema<TDocument extends Document> extends Schema<TDocument> {
  constructor(object: Object) {
    super({
      ...object,
      createdAt: {
        type: Date,
        default: new Date(),
      },
      updatedAt: {
        type: Date,
        default: new Date(),
      },
      state: {
        type: Number,
        default: STATE.ACTIVE,
      },
    });
  }
}
