import Article from "../models/Article.model.js";
import Comment from "../models/Comment.model.js";
import Response from "../helpers/responses.js";

class Articles {
  static get = async (req, res) => {
    Article.find()
      .then((articles) => {
        return Response.success(
          res,
          200,
          "Articles fetched successfully",
          articles
        );
      })
      .catch((err) => {
        return Response.error(res, 500, "Internal Server Error");
      });
  };

  static getOne = async (req, res) => {
    Article.findOne({ _id: req.params.id })
      .then((article) => {
        if (article) {
          Comment.find({ articleId: article._id }).then((comments) => {
            return Response.success(res, 200, "Article fetched successfully", {
              article,
              comments,
            });
          });
        } else {
          return Response.error(
            res,
            404,
            "The article with given id does not exist"
          );
        }
      })
      .catch((err) => {
        Response.error(res, 500, "Internal Server Error");
      });
  };

  static create = async (req, res) => {
    const article = new Article({
      title: req.body.title,
      body: req.body.content,
      imageUrl: req.body.imageUrl,
      publishedOn: new Date().toLocaleString(),
    });

    article
      .save()
      .then((article) => {
        Response.success(res, 201, "Article created successfully", article);
      })
      .catch((err) => Response.error(res, 500, "Internal Server Error"));
  };

  static update = async (req, res) => {
    const { title, content, imageUrl } = req.body;

    Article.findOne({ _id: req.params.id })
      .then((article) => {
        article.title = title || article.title;
        article.body = content || article.body;
        article.imageUrl = imageUrl || article.imageUrl;

        article.save().then((updated) => {
          Response.success(res, 200, "Article updated successfully", updated);
        });
      })
      .catch((err) => Response.error(res, 500, "Internal Server Error"));
  };

  static delete = async (req, res) => {
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
