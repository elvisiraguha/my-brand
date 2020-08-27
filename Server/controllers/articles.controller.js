import Article from "../models/Article.model.js";
import Comment from "../models/Comment.model.js";
import Response from "../helpers/responses.js";

class Articles {
  static getAll = async (req, res) => {
    const articles = await Article.find();
    return Response.success(
      res,
      200,
      "Articles fetched successfully",
      articles
    );
  };

  static getOne = async (req, res) => {
    const article = await Article.findOne({ _id: req.params.id });
    if (article) {
      const comments = await Comment.find({ articleId: article._id });
      return Response.success(res, 200, "Article fetched successfully", {
        article,
        comments,
      });
    } else {
      return Response.error(
        res,
        404,
        "The article with given id does not exist"
      );
    }
  };

  static create = async (req, res) => {
    const article = new Article({
      title: req.body.title,
      body: req.body.content,
      imageUrl: req.body.imageUrl,
      publishedOn: new Date().toLocaleString(),
    });

    const created = await article.save();
    Response.success(res, 201, "Article created successfully", created);
  };

  static update = async (req, res) => {
    const { title, content, imageUrl } = req.body;

    const article = await Article.findOne({ _id: req.params.id });

    article.title = title || article.title;
    article.body = content || article.body;
    article.imageUrl = imageUrl || article.imageUrl;

    const updated = await article.save();
    Response.success(res, 200, "Article updated successfully", updated);
  };

  static deleteOne = async (req, res) => {
    Article.deleteOne({ _id: req.params.id }, (error) => {
      if (error) {
        Response.error(res, 500, "Internal Server Error");
      } else {
        Response.success(res, 200, "Article deleted successfully");
      }
    });
  };
}

export default Articles;
