import { IResponseBase } from "../../models/core/";
import { Document, Model } from "mongoose";

export interface IRead<T> {
  getPaginatedAll(
    schema: Model<Document<T>>,
    page: number,
    qyt: number,
    filter: Object,
    full: boolean,
    related_entities?: Array<keyof T>
  ): Promise<IResponseBase>;
  getById(
    schema: Model<Document<T>>,
    id: String,
    related_entities?: Array<keyof T>
  ): Promise<IResponseBase>;
}

export interface IWrite<T> {
  create(schema: Document<T>): Promise<IResponseBase>;
  update(
    id: String,
    doc: T,
    schema: Model<Document<T>>
  ): Promise<IResponseBase>;
  delete(id: String, schema: Model<Document<T>>): Promise<IResponseBase>;
}

export default interface IBaseRepository<T> extends IRead<T>, IWrite<T> {}
