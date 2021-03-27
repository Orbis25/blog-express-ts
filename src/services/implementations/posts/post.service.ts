import { PostModel } from "../../../models/posts/post.schema";
import BaseRepository from "../../repository/BaseRepository";
import { IPostService } from "../../interfaces/";
import { IResponseBase } from "../../../models/core";
import likeSchema, { LikeModel } from "../../../models/posts/like.schema";

export default class PostService
  extends BaseRepository<PostModel>
  implements IPostService {
  async userLiked({
    user,
    post,
  }: {
    user: string;
    post: string;
  }): Promise<IResponseBase> {
    try {
      const result = await likeSchema.find({
        user,
        post,
      });
      console.log(result);
      return { ok: true, result: !result ? false : true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
  async removeLike({
    user,
    post,
  }: {
    user: string;
    post: string;
  }): Promise<IResponseBase> {
    try {
      const result = await likeSchema.findOneAndDelete({ post, user });
      if (!result) return { ok: false, error: "not found" };
      return { ok: true, result };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
  async setLike(model: LikeModel): Promise<IResponseBase> {
    try {
      const exist = await likeSchema.findOne({
        post: model.post,
        user: model.user,
      });
      if (!exist) {
        const schema = new likeSchema(model);
        return { ok: true, result: await schema.save() };
      }
      return { ok: false, error: "exist a like for this post and user" };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
}
