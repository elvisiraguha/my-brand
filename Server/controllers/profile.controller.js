import ProfileItem from "../models/ProfileItem.model.js";
import ProfileInfo from "../models/ProfileInfo.model.js";
import Comment from "../models/Comment.model.js";
import Response from "../helpers/responses.js";

class Profile {
  static getItems = async (req, res) => {
    ProfileItem.find()
      .then((items) => {
        return Response.success(
          res,
          200,
          "Profile items fetched successfully",
          items
        );
      })
      .catch((err) => {
        return Response.error(res, 500, "Internal Server Error");
      });
  };

  static getInfo = async (req, res) => {
    ProfileInfo.findOne({ type: "info" })
      .then((info) => {
        return Response.success(
          res,
          200,
          "Profile info fetched successfully",
          info
        );
      })
      .catch((err) => {
        return Response.error(res, 500, "Internal Server Error");
      });
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

    ProfileInfo.findOne({ type: "info" })
      .then((info) => {
        info.address = address || info.address;
        info.email = email || info.email;
        info.intro = intro || info.intro;
        info.phone = phone || info.phone;
        info.profileImageUrl = profileImageUrl || info.profileImageUrl;
        info.subTitle = subTitle || info.subTitle;
        info.title = title || info.title;

        info.save().then((updated) => {
          Response.success(res, 200, "Info updated successfully", updated);
        });
      })
      .catch((err) => {
        return Response.error(res, 500, "Internal Server Error");
      });
  };

  static deleteItem = async (req, res) => {
    ProfileItem.deleteOne({ _id: req.params.id }, (error) => {
      if (error) {
        Response.error(res, 500, "Internal Server Error");
      } else {
        Response.success(res, 200, "Item deleted successfully");
      }
    });
  };

  static createSkill = async (req, res) => {
    const skill = new ProfileItem({
      type: "skill",
      title: req.body.title,
      logoUrl: req.body.logoUrl,
    });

    skill
      .save()
      .then((skill) => {
        Response.success(res, 201, "Skill created successfully", skill);
      })
      .catch((err) => Response.error(res, 500, "Internal Server Error"));
  };

  static updateItem = async (req, res) => {
    const { title, logoUrl, description, link, startDate, endDate } = req.body;

    ProfileItem.findOne({ _id: req.params.id })
      .then((item) => {
        item.title = title || item.title;
        item.logoUrl = logoUrl || item.logoUrl;
        item.description = description || item.description;
        item.link = link || item.link;
        item.startDate = startDate || item.startDate;
        item.endDate = endDate || item.endDate;

        item.save().then((updated) => {
          Response.success(res, 200, "Item updated successfully", updated);
        });
      })
      .catch((err) => {
        Response.error(res, 500, "Internal Server Error");
      });
  };

  static createProject = async (req, res) => {
    const project = new ProfileItem({
      type: "project",
      title: req.body.title,
      description: req.body.description,
      logoUrl: req.body.logoUrl,
      link: req.body.link,
    });

    project
      .save()
      .then((project) => {
        Response.success(res, 201, "Project created successfully", project);
      })
      .catch((err) => Response.error(res, 500, "Internal Server Error"));
  };

  static createExperience = async (req, res) => {
    const experience = new ProfileItem({
      type: "experience",
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    experience
      .save()
      .then((experience) => {
        Response.success(
          res,
          201,
          "Experience created successfully",
          experience
        );
      })
      .catch((err) => Response.error(res, 500, "Internal Server Error"));
  };
}

export default Profile;
