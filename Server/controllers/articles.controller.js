import Article from "../models/Article.model.js";
import Response from "../helpers/responses.js";

class Articles {
  static get = async (req, res) => {
    Article.find()
      .then((articles) => {
        Response.success(res, 200, "Articles fetched successfully", articles);
      })
      .catch((err) => Response.error(res, 404, "Articles Not Found"));
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
      .catch((err) => Response.error(res, 404, "Article Not Found"));
  };

  static create = async (req, res) => {
    const article = new Article({
      title: req.body.title,
      body: req.body.content,
      imageUrl: req.body.url,
      publishedOn: new Date().toLocaleString(),
    });

    article
      .save()
      .then((article) => {
        Response.success(res, 201, "Article created successfully", article);
      })
      .catch((err) => Response.error(res, 500, err));
  };
}

export default Articles;
