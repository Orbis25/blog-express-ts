import postSchema, { PostModel } from "../../../models/posts/post.schema";
import BaseRepository from "../../repository/BaseRepository";
import { IPostService } from "../../interfaces/";
import { IResponseBase } from "../../../models/core";
import likeSchema, { LikeModel } from "../../../models/posts/like.schema";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import { moveFile } from "../../../utils/helpers/files.helpers";
import { STATE } from "../../../models/enums/State.enum";
import { POST_FOLDER } from "../../../const/uploads.const";

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

  private async removeImageUploaded(id: string, path: string) {
    const filter = { state: STATE.ACTIVE, _id: id } as any;
    const post = await postSchema.findOne(filter);
    if (post) {
      const result = (post as unknown) as PostModel;
      if (result.photo_url) {
        try {
          if (fs.existsSync(path + result.photo_url)) {
            fs.unlinkSync(path + result.photo_url);
          }
        } catch (error) {
          throw new Error(error);
        }
      }
    }
  }

  async uploadImage(
    files: fileUpload.FileArray | undefined,
    id: string
  ): Promise<IResponseBase> {
    const { photo } = files as any;

    if (!files || Object.keys(files).length === 0)
      return { ok: false, error: "file required" };

    const base_path =
      (process.env.FILE_DESTINATION as string) || "/public/uploads/";
    const file_path = process.cwd() + base_path + POST_FOLDER;
    const newFile = Date.now() + id + path.extname(photo.name);

    //if post have image remove this
    await this.removeImageUploaded(id, file_path);

    if (fs.existsSync(file_path)) {
      const result = await moveFile(photo, file_path + newFile);
      if (result) return { ok: false, result: "error upload file" };
      await this.update(id, { photo_url: newFile } as PostModel, postSchema);
      return { ok: true, result: "uploaded file" };
    } else {
      fs.mkdirSync(file_path, { recursive: true });
      const result = await moveFile(photo, file_path + newFile);
      if (result) return { ok: false, result: "error upload file" };
      await this.update(id, { photo_url: newFile } as PostModel, postSchema);
      return { ok: true, result: "uploaded file" };
    }
  }
}
