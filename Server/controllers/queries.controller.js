import Querie from "../models/Querie.model.js";
import Response from "../helpers/responses.js";

class Queries {
  static post = async (req, res) => {
    const querie = new Querie({
      name: req.body.name,
      email: req.body.name,
      subject: req.body.subject,
      message: req.body.name,
    })

    querie.save()
    .then((article) => {
        Response.success(res, 201, "Message sent successfully", article);
      })
      .catch((err) => Response.error(res, 500, "Internal Server Error"));
  };

  static get = async (req, res) => {
    Querie.find()
      .then((queries) => {
        Response.success(res, 200, "Queries fetched successfully", queries);
      })
      .catch((err) => {
        return Response.error(res, 500, "Internal Server Error");
      });
  };
}

export default Queries;