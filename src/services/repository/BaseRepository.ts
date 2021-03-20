import { Document, Model } from "mongoose";
import { IPaginatedModel, IResponseBase } from "../../models/core";
import IBaseRepository, { FullDocumentEnum } from "./IBaseRepository";

export default class BaseRepository<T> implements IBaseRepository<T> {
  async getPaginatedAll(
    schema: Model<Document<T>>,
    page: number = 1,
    qyt: number = 10,
    filter: Object = {},
    full: FullDocumentEnum = FullDocumentEnum.Paginated
  ): Promise<IResponseBase> {
    try {
      if (full) {
        return { ok: true, result: await schema.find(filter).exec() };
      }

      const dbResults = await schema
        .find(filter)
        .skip((page - 1) * qyt)
        .limit(qyt)
        .exec();

      const total = await schema.countDocuments();
      const result = {
        page,
        pages: Math.round(total / qyt) + 1,
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
      const result = await schema.findById(id);
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
      const result = await schema.findByIdAndUpdate(id, doc, { new: true });
      if (!result) return { ok: false, error: "entity not found" };
      return { ok: true, result };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
  async delete(id: String, schema: Model<Document<T>>): Promise<IResponseBase> {
    try {
      const result = await schema.findByIdAndDelete(id);
      if (!result) return { ok: false, error: "entity not found" };
      return { ok: true, result };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
}
