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

    const created = await query.save();
    Response.success(res, 201, "Message sent successfully", created);
  };

  static getAll = async (req, res) => {
    const queries = await Query.find();
    Response.success(res, 200, "Queries fetched successfully", queries);
  };

  static update = async (req, res) => {
    const query = await Query.findOne({ _id: req.params.id });
    query.read = req.body.read;

    const updated = await query.save();
    Response.success(res, 200, `Read marked ${updated.read}`, updated);
  };
}

export default Queries;
