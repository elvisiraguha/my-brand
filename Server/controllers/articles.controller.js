import Article from "../models/Article.model.js";
import Response from "../helpers/responses.js";

class Articles {
  static get = async (req, res) => {
    Article.find()
      .then((articles) => {
        Response.success(res, 200, "Articles fetched successfully", articles);
      })
      .catch((err) => Response.error(res, 500, "Internal Server Error"));
  };

  static getOne = async (req, res) => {
    Article.findOne({ _id: req.params.id })
      .then((article) => {
        if (article) {
          Response.success(res, 200, "Article fetched successfully", article);
        } else {
          Response.error(res, 404, "Article  Not Found");
        }
      })
      .catch((err) => Response.error(res, 500, "Internal Server Error"));
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
    Article.findOne({ _id: req.params.id })
      .then((article) => {
        if (article) {
          if (req.body.title) {
            article.title = req.body.title;
          }
          if (req.body.content) {
            article.body = req.body.content;
          }
          if (req.body.imageUrl) {
            article.imageUrl = req.body.imageUrl;
          }

          try {
            article.save().then((updated) => {
              Response.success(
                res,
                201,
                "Article updated successfully",
                updated
              );
            });
          } catch (error) {
            Response.error(res, 500, "Internal Server Error");
          }
        } else {
          Response.error(res, 500, "Internal Server Error");
        }
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
