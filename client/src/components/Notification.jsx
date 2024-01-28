import React, { useEffect, useRef, useState } from "react";
import "./Notification.css";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { BiChevronDown } from "react-icons/bi";
import { BiChevronUp } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { TextInput } from "../components";
import { NotificationSkeleton } from "./NotificationSkeleton";

import "animate.css";
import emailjs from "emailjs-com";

const ApplicationCard = ({ application }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [jobDetail, setJobDetail] = useState(null);
  const timeRef = useRef(null);
  const dateRef = useRef(null);
  const [isFetching, setIsFetching] = useState(true);
  const theme = localStorage.getItem("theme");

  const emailjsConfig = {
    serviceID: "service_tflb4xt",
    templateID: "template_2htthlx",
    userID: "fDzm9GSO-27mzN7ZD",
  };
  const getJobDetails = async () => {
    try {
      const res = await apiRequest({
        url: "/jobs/get-job-detail/" + application.jobId,
        method: "GET",
      });
      setJobDetail(res?.data);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };

  // const extractEmail = (inputString) => {
  //   const pattern = /([^.\s]+\.com)\b/;

  //   const match = inputString?.match(pattern);
  //   const extractedEmail = match ? match[1] : null;
  //   return extractedEmail;
  // };
  const handleDeclinePressed = async () => {
    const { status, ...data } = application;
    data.status = "declined";

    const res = await apiRequest({
      url: `/jobs/update-application`,
      data: data,
      method: "PUT",
    });
    try {
      if (res.status === "failed") {
        toast.dismiss();
        toast.error("Failed to send! Try again.", {
          duration: 5000,
          position: "top-right",
        });
      } else {
        toast.dismiss();
        const email = application?.email;

        emailjs.send(
          emailjsConfig.serviceID,
          emailjsConfig.templateID,
          {
            to_name: application?.applicantName,
            to_email: email,
            message: `We are sorry to inform you that after careful review, your job application for ${jobDetail?.jobTitle} has been declined. Your current skills don't match our requirements. We'll contact you once we have an opening for your skillset.`,
          },
          emailjsConfig.userID
        );

        toast.success("Application Declined.", {
          duration: 5000,
          position: "top-right",
        });
        setIsDetailOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCallForInterviewPressed = async () => {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i;

    if (!dateRegex.test(dateRef.current.value)) {
      toast.dismiss();
      toast.error("Invalid date format, Please enter in dd/mm/yy", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }
    if (!timeRegex.test(timeRef.current.value)) {
      toast.dismiss();
      toast.error("Invalid time format, Please enter in HH:MM am/pm", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    if (timeRef.current.value == "" || dateRef.current.value == "") {
      toast.dismiss();
      toast.error("Date and time required", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }
    const { status, ...data } = application;
    data.status = "called";
    data.interviewTime = timeRef.current.value;
    data.interviewDate = dateRef.current.value;

    try {
      const res = await apiRequest({
        url: `/jobs/update-application`,
        data: data,
        method: "PUT",
      });
      console.log(res);
      if (res.status === "failed") {
        toast.dismiss();

        toast.error("Can't call for interview", {
          duration: 5000,
          position: "top-right",
        });
      } else {
        toast.dismiss();

        const email = application?.email;

        emailjs.send(
          emailjsConfig.serviceID,
          "template_7ooq4rh",
          {
            to_name: application?.applicantName,
            to_email: email,
            message: `Your job application for ${jobDetail?.jobTitle} has been accepted. The interview date and time is given below, you will recieve a Microsoft teams meet link soon. `,
            date: dateRef.current.value,
            time: timeRef.current.value,
          },
          emailjsConfig.userID
        );

        toast.success(`Email sent to ${application.applicantName}`, {
          duration: 5000,
          position: "top-right",
        });
        setIsDetailOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobDetails();
  }, []);

  return (
    <div
      className={`${
        theme === "dark"
          ? "flex flex-col justify-between gap-8 shadow-lg p-2 sm:p-7 bg-slate-600 rounded-md text-white"
          : "flex flex-col justify-between gap-8 shadow-lg p-2 sm:p-7"
      }`}
    >
      {isFetching && <NotificationSkeleton />}
      {!isFetching && (
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          <div className="flex flex-row items-center justify-center gap-4">
            <img className="w-16 rounded-[50%]" src={application.userPhoto} />
            <p className="text-lg sm:text-xl ">
              {application.applicantName} has Applied for {jobDetail?.jobTitle}
            </p>
            {application.status === "declined" && (
              <p
                className={`${
                  theme === "dark"
                    ? "text-white text-lg sm:text-xl"
                    : "text-red-700 text-lg sm:text-xl"
                }`}
              >
                Declined
              </p>
            )}
            {application.status === "called" && (
              <p
                className={`${
                  theme === "dark"
                    ? "text-white text-lg sm:text-xl"
                    : "text-green-900 text-lg sm:text-xl"
                }`}
              >
                Called For Interview
              </p>
            )}
          </div>
          <div
            className="flex flex-row justify-between items-center"
            onClick={() => setIsDetailOpen((prev) => !prev)}
          >
            <a className="font-bold sm:text-lg hover:cursor-pointer hover:underline">
              {isDetailOpen ? "Hide Details" : "View Details"}
            </a>
            {isDetailOpen ? <BiChevronUp /> : <BiChevronDown />}
          </div>
        </div>
      )}
      {isDetailOpen && (
        <div className="flex flex-col gap-4 animate__animated animate__fadeIn">
          <p className="font-bold">
            Previous Salary:{" "}
            <span className="font-normal">{application.salary}</span>
          </p>
          <p className="font-bold">
            Can start immediately:{" "}
            <span className="font-normal">{application.start}</span>
          </p>
          <p className="font-bold">
            LinkdIn Profile:{" "}
            <span className="font-normal">{application.linkedin}</span>
          </p>
          <p className="font-bold">
            Fluent In English:{" "}
            <span className="font-normal">{application.fluent}</span>
          </p>
          <p className="font-bold">
            Cover Letter:
            <br />{" "}
            <span className="font-normal">{application.coverletter}</span>
          </p>
          <p className="font-bold">
            Additional Comments:
            <br /> <span className="font-normal">{application.comments}</span>
          </p>
          {application.status === "pending" && (
            <>
              <div className="w-full flex flex-col sm:flex-row justify-evenly items-start sm:items-center gap-5">
                <button
                  className={`${
                    theme === "dark"
                      ? "p-3  bg-slate-700 rounded-md"
                      : "p-3  bg-red-100 rounded-md"
                  }`}
                >
                  <a href={application.cvUrl} target="_blank">
                    View CV
                  </a>
                </button>
                <button
                  className="p-3 bg-red-600 rounded-md border-none text-white"
                  onClick={handleDeclinePressed}
                >
                  Decline
                </button>
              </div>
              <div className="p-4 flex flex-col gap-5">
                <TextInput
                  ref={timeRef}
                  name="time"
                  label="Interview Time"
                  placeholder="05:00pm"
                  type="text"
                />
                <TextInput
                  ref={dateRef}
                  name="date"
                  label="Interview Date"
                  placeholder="06/06/2024"
                  type="text"
                />
                <button
                  onClick={handleCallForInterviewPressed}
                  className="w-1/4 p-3 bg-green-600 rounded-md border-none text-white"
                >
                  Call For Interview
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Notification = () => {
  const { user } = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [finalApplications, setFinalApplications] = useState([]);
  const companyId = user?._id;
  const [data, getData] = useState(true);
  const theme = localStorage.getItem("theme");

  const getApplications = async () => {
    if (user.accountType !== "seeker") {
      try {
        const res = await apiRequest({
          url: `/jobs/applications?companyId=${companyId}`,
          method: "GET",
        });

        setApplications(res.data);

        getData(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const SetFinalApplication = () => {
    applications.map((application, index) => {
      application.application.map((singleApplication, index) => {
        //singleApplication is array of object of one job
        singleApplication.map((application, index) => {
          setFinalApplications((prev) => [...prev, application]);
        });
      });
    });
  };

  useEffect(() => {
    getApplications();
    SetFinalApplication();
  }, [data]);

  return (
    <div className={`${theme === "dark" ? " sm:p-2 bg-slate-700" : "sm:p-2 "}`}>
      {user.accountType === "seeker" ? (
        <div>
          <h1>No Seeker Notification</h1>
        </div>
      ) : (
        <div className="m-3 sm:m-10 p-0 sm:p-6 flex flex-col gap-6 ">
          <h1
            className={`${
              theme === "dark"
                ? " font-bold text-2xl sm:text-3xl self-center text-white"
                : "font-bold text-2xl sm:text-3xl self-center"
            }`}
          >
            NOTIFICATIONS
          </h1>
          {finalApplications.length <= 0
            ? "No notifications"
            : finalApplications.map((application, index) => (
                <ApplicationCard application={application} />
              ))}
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default Notification;
