import BaseRepository from "../../repository/BaseRepository";
import { CommentModel } from "../../../models/comments/comment.model";
import IBaseRepository from "../../repository/IBaseRepository";

export default class CommentService
  extends BaseRepository<CommentModel>
  implements IBaseRepository<CommentModel> {}
