import { PostModel } from "../../../models/posts/post.schema";
import BaseRepository from "../../repository/BaseRepository";
import IPostService from "../../interfaces/posts/post.interface";

export default class PostService
  extends BaseRepository<PostModel>
  implements IPostService {}
