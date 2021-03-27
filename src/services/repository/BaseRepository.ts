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
    full: boolean = false,
    related_entities?: Array<keyof T>
  ): Promise<IResponseBase> {
    try {
      let schema_results = schema.find({ ...filter, state: STATE.ACTIVE });

      //get relations
      if (related_entities) {
        related_entities.forEach((entity) => {
          schema_results = schema_results.populate(entity);
        });
      }

      //return full data
      if (full) {
        return {
          ok: true,
          result: await schema_results.exec(),
        };
      }

      const total = await schema
        .find({ ...filter, state: STATE.ACTIVE })
        .countDocuments();

      //prepare the object
      const result = {
        page,
        pages: Math.ceil(total / qyt),
        qyt: qyt,
        total,
        results: await schema_results
          .skip((page - 1) * qyt)
          .limit(qyt)
          .exec(),
      } as IPaginatedModel<Document<T>>;

      return { ok: true, result: result };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
  async getById(
    schema: Model<Document<T>>,
    id: String,
    related_entities?: Array<keyof T>
  ): Promise<IResponseBase> {
    try {
      const filter = { _id: id, state: STATE.ACTIVE } as any;
      let result = schema.findOne(filter);

      //get relations
      if (related_entities) {
        related_entities.forEach((entity) => {
          result = result.populate(entity);
        });
      }

      const entity = await result.exec();
      if (!entity) return { ok: false, error: "entity not found" };
      return { ok: true, result: entity };
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
