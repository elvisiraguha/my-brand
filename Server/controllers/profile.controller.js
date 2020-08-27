import ProfileItem from "../models/ProfileItem.model.js";
import ProfileInfo from "../models/ProfileInfo.model.js";
import Comment from "../models/Comment.model.js";
import Response from "../helpers/responses.js";

class Profile {
  static getItems = async (req, res) => {
    const items = await ProfileItem.find();
    return Response.success(
      res,
      200,
      "Profile items fetched successfully",
      items
    );
  };

  static getInfo = async (req, res) => {
    const info = await ProfileInfo.findOne({ type: "info" });
    return Response.success(
      res,
      200,
      "Profile info fetched successfully",
      info
    );
  };

  static updateInfo = async (req, res) => {
    const {
      address,
      email,
      intro,
      phone,
      subTitle,
      title,
      profileImageUrl,
    } = req.body;

    const info = await ProfileInfo.findOne({ type: "info" });

    info.address = address || info.address;
    info.email = email || info.email;
    info.intro = intro || info.intro;
    info.phone = phone || info.phone;
    info.profileImageUrl = profileImageUrl || info.profileImageUrl;
    info.subTitle = subTitle || info.subTitle;
    info.title = title || info.title;

    const updated = await info.save();
    Response.success(res, 200, "Info updated successfully", updated);
  };

  static deleteItem = async (req, res) => {
    await ProfileItem.deleteOne({ _id: req.params.id });
    Response.success(res, 200, "Item deleted successfully");
  };

  static createItem = async (req, res) => {
    const item = new ProfileItem({
      type: req.query.itemType,
      title: req.body.title,
      description: req.body.description,
      logoUrl: req.body.logoUrl,
      link: req.body.link,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    const created = await item.save();
    Response.success(res, 201, "Item created successfully", created);
  };

  static updateItem = async (req, res) => {
    const { title, logoUrl, description, link, startDate, endDate } = req.body;

    const item = await ProfileItem.findOne({ _id: req.params.id });

    item.title = title || item.title;
    item.logoUrl = logoUrl || item.logoUrl;
    item.description = description || item.description;
    item.link = link || item.link;
    item.startDate = startDate || item.startDate;
    item.endDate = endDate || item.endDate;

    const updated = await item.save();
    Response.success(res, 200, "Item updated successfully", updated);
  };
}

export default Profile;
