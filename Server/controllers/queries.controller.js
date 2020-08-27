import Query from "../models/Query.model.js";
import Response from "../helpers/responses.js";

class Queries {
  static post = async (req, res) => {
    const query = new Query({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      read: false,
    });

    query
      .save()
      .then((response) => {
        Response.success(res, 201, "Message sent successfully", response);
      })
      .catch((err) => Response.error(res, 500, "Internal Server Error"));
  };

  static get = async (req, res) => {
    Query.find()
      .then((queries) => {
        Response.success(res, 200, "Queries fetched successfully", queries);
      })
      .catch((err) => {
        return Response.error(res, 500, "Internal Server Error");
      });
  };

  static update = async (req, res) => {
    Query.findOne({ _id: req.params.id })
      .then((query) => {
        query.read = req.body.read;

        query.save().then((updated) => {
          Response.success(res, 200, `Read marked ${updated.read}`, updated);
        });
      })
      .catch((err) => {
        return Response.error(res, 500, "Internal Server Error");
      });
  };
}

export default Queries;
