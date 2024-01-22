import mongoose from "mongoose";
import Users from "../models/userModel.js";
import Jobs from "../models/jobsModel.js";

export const updateUser = async (req, res, next) => {
  console.log(req.body);
  const {
    firstName,
    lastName,
    email,
    contact,
    location,
    profileUrl,
    jobTitle,
    about,
    cv,
    jobId,
  } = req.body;
  const hasCV = cv;
  console.log(jobId);
  console.log(profileUrl);
  try {
    // if (!firstName || !lastName || !email || !contact || !jobTitle || !about) {
    //   next("Please provide all required fields");
    // }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No User with id: ${id}`);
    }

    let updateUser;

    if (jobId) {
      updateUser = {
        firstName,
        lastName,
        email,
        contact,
        location,
        profileUrl,
        jobTitle,
        about,
        _id: id,
        cv: hasCV,
        $push: { applications: jobId },
      };
    } else {
      updateUser = {
        firstName,
        lastName,
        email,
        contact,
        location,
        profileUrl,
        jobTitle,
        about,
        _id: id,
        cv: hasCV,
      };
    }

    const user = await Users.findByIdAndUpdate(id, updateUser, { new: true });

    console.log(user);

    const token = user.createJWT();

    user.password = undefined;

    res.status(200).json({
      sucess: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const user = await Users.findById({ _id: id });

    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

export const getUserApplications1 = async (req, res) => {
  const userId = req.body.user.userId;
  const returningApplications = [];

  const user = await Users.findById(userId);
  user.applications.map(async (jobId) => {
    const job = await Jobs.findById(jobId);
    const userApplications = job.application.filter(
      (currAppl) => currAppl.user.userId == userId
    );
    console.log(userApplications);
    // console.log(job.application[0].user.userId)
    returningApplications.push(job);
  });
  console.log("Returning Application", returningApplications);
};
export const getUserApplications = async (req, res) => {
  const userId = req.body.user.userId;
  let returningApplications = [];

  const user = await Users.findById(userId);
  console.log("UserApplications", user.applications);
  for (let i = 0; i < user.applications.length; i++) {
    let job = await Jobs.findById(user.applications[i]);
    // console.log("JOB APPLICATION",job.application)
    const userApplications = job.application.filter(
      (currAppl) => currAppl[0].user.userId == userId
    );
    // console.log(userApplications[0])
    for (let i = 0; i < userApplications.length; i++)
      returningApplications.push(userApplications[i][0]);
  }
  // console.log("ReturningApplications:",returningApplications)
  res.status(200).json({ data: returningApplications });
};
