import { Document, Model } from "mongoose";
import { IPaginatedModel, IResponseBase } from "../../models/core";
import IBaseRepository from "./IBaseRepository";
import { STATE } from "../../models/enums/State.enum";

export default abstract class BaseRepository<T> implements IBaseRepository<T> {
  async getPaginatedAll(
    schema: Model<Document<T>>,
    page: number = 1,
    qyt: number = 10,
    filter: Object = {},
    full: boolean
  ): Promise<IResponseBase> {
    try {
      if (full) {
        return {
          ok: true,
          result: await schema.find({ ...filter, state: STATE.ACTIVE }).exec(),
        };
      }

      const dbResults = await schema
        .find({ ...filter, state: STATE.ACTIVE })
        .skip((page - 1) * qyt)
        .limit(qyt)
        .exec();

      const total = await schema.countDocuments();
      const result = {
        page,
        pages: Math.ceil(total / qyt),
        qyt: qyt,
        total,
        results: dbResults,
      } as IPaginatedModel<Document<T>>;

      return { ok: true, result: result };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
  async getById(
    schema: Model<Document<T>>,
    id: String
  ): Promise<IResponseBase> {
    try {
      const filter = { _id: id, state: STATE.ACTIVE };
      const result = await schema.findOne(filter as any).exec();
      if (!result) return { ok: false, error: "entity not found" };
      return { ok: true, result };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async create(schema: Document<T>): Promise<IResponseBase> {
    try {
      const result = await schema.save();
      return { ok: true, result };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
  async update(
    id: String,
    doc: T,
    schema: Model<Document<T>>
  ): Promise<IResponseBase> {
    try {
      const filter = { _id: id, state: STATE.ACTIVE } as any;
      const result = await schema.findOneAndUpdate(filter, doc, { new: true });
      if (!result) return { ok: false, error: "entity not found" };
      return { ok: true, result };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
  async delete(id: String, schema: Model<Document<T>>): Promise<IResponseBase> {
    try {
      const filter = { _id: id, state: STATE.ACTIVE } as any;
      const result = await schema.findOneAndUpdate(
        filter,
        { state: STATE.REMOVED } as any,
        { new: true }
      );
      if (!result) return { ok: false, error: "entity not found" };
      return { ok: true, result };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
}
