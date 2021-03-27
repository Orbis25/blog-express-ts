import BaseRepository from "../../repository/BaseRepository";
import { IResponseBase } from "../../../models/core";
import { STATE } from "../../../models/enums/State.enum";
import { Document } from "mongoose";
import IPaginatedModel from "../../../models/core/Paginated.model";
import CommentSchema, {
  CommentModel,
} from "../../../models/comments/comment.model";
import { ICommentService } from "../../interfaces";
import PostSchema from "../../../models/posts/post.schema";

export default class CommentService
  extends BaseRepository<CommentModel>
  implements ICommentService {
  async getAllComments(
    postId: string,
    page: number,
    qyt: number,
    isFull: Boolean
  ): Promise<IResponseBase> {
    const schema = CommentSchema;

    let searched_data = schema.find({ state: STATE.ACTIVE, post: postId });
    //return full data
    if (isFull) {
      return {
        ok: true,
        result: await schema.find({ state: STATE.ACTIVE }).exec(),
      };
    }

    try {
      const total = await schema
        .find({ state: STATE.ACTIVE, post: postId })
        .countDocuments();

      const result = {
        page,
        qyt,
        total,
        pages: Math.ceil(total / qyt),
        results: await searched_data
          .skip((page - 1) * qyt)
          .limit(qyt)
          .exec(),
      } as IPaginatedModel<Document<CommentModel>>;

      return { ok: true, result };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
}
