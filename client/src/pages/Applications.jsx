import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { BiChevronDown } from "react-icons/bi";
import { BiChevronUp } from "react-icons/bi";
import "animate.css";
import ApplicationSkeleton from "./ApplicationSkeleton";

function Applications() {
  const { user } = useSelector((state) => state.user);
  const [application, setApplications] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const getAllApplications = async () => {
    const userId = user._id;

    try {
      const res = await apiRequest({
        url: "/users/get-user-applications",
        data: { userId },
        token: user?.token,
        method: "GET",
      });
      setApplications(res?.data);
      setIsFetching(false);
    } catch (err) {
      setIsFetching(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getAllApplications();
  }, []);

  return (
    <div className="dark:bg-slate-800 p-2 sm:p-20">
      {isFetching && <ApplicationSkeleton cards={4} />}
      {application?.length < 1 && !isFetching ? (
        <div className="flex flex-col gap-6 items-center justify-center ">
          <h1 className="text-3xl dark:text-white">No Pending Applications</h1>
          <a
            className="text-xl hover:underline dark:text-white hover:text-blue-600"
            href="https://workease-bese27c.vercel.app/find-jobs"
          >
            Continue Job Search
          </a>
        </div>
      ) : (
        <>
          {!isFetching &&
            application?.map((application) => (
              <ApplicationCard
                length={application.length}
                key={application.jobId}
                application={application}
              />
            ))}
        </>
      )}
    </div>
  );
}

const ApplicationCard = ({ application, length }) => {
  const [job, setJob] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const getJobDetails = async () => {
    try {
      const res = await apiRequest({
        url: "/jobs/get-job-detail/" + application.jobId,
        method: "GET",
      });
      setJob(res?.data);
      setTimeout(() => {
        setIsFetching(false);
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobDetails();
  }, []);

  return (
    <>
      {isFetching ? (
        <ApplicationSkeleton cards={length} />
      ) : (
        <div className="flex flex-col mb-4 rounded-md justify-between gap-8 shadow-lg p-2 sm:p-12 dark:bg-slate-700">
          <div className="flex flex-col sm:flex-row justify-between gap-8">
            <div className="flex flex-row items-center justify-center gap-4">
              <img
                className="w-16 rounded-[50%]"
                src={job?.company?.profileUrl}
              />
              {application?.status !== "called" ? (
                <p
                  className={`${
                    application.status === "declined" &&
                    "text-red-600 dark:text-red-500"
                  } text-lg sm:text-xl dark:text-white`}
                >
                  Your Application for {job?.jobTitle} is {application?.status}
                </p>
              ) : (
                <p className="text-green-800 text-lg sm:text-xl dark:text-white">
                  Congratulation!! You have been called for interview at{" "}
                  {job?.company?.name}
                </p>
              )}
            </div>
            <div
              className="flex flex-row justify-between items-center"
              onClick={() => setIsDetailOpen((prev) => !prev)}
            >
              <a className="font-bold sm:text-lg hover:cursor-pointer hover:underline dark:text-white">
                {isDetailOpen ? "Hide Details" : "View Details"}
              </a>
              {isDetailOpen ? (
                <BiChevronUp className="dark:text-white" />
              ) : (
                <BiChevronDown className="dark:text-white" />
              )}
            </div>
          </div>
          {isDetailOpen && (
            <div className="flex flex-col gap-4 animate__animated animate__fadeIn">
              <h1 className="font-bold text-3xl dark:text-white">
                Company Info
              </h1>
              <p className="font-bold dark:text-slate-400">
                Company:{" "}
                <span className="font-normal hover:underline hover:text-blue-600">
                  <a
                    href={`https://workease-bese27c.vercel.app/company-profile/${job?.company?._id}`}
                  >
                    {job?.company?.name}
                  </a>
                </span>
              </p>
              <p className="font-bold dark:text-slate-400">
                Email:{" "}
                <span className="font-normal">{job?.company?.email}</span>
              </p>
              <h1 className="font-bold text-3xl dark:text-white">Job Info</h1>
              <p className="font-bold dark:text-slate-400">
                Type: <span className="font-normal">{job?.jobType}</span>
              </p>
              <p className="font-bold dark:text-slate-400">
                Location: <span className="font-normal">{job?.location}</span>
              </p>
              <p className="font-bold dark:text-slate-400">
                Starting Salary:{" "}
                <span className="font-normal">{job?.salary}</span>
              </p>
              {application.status === "called" && (
                <>
                  <h1 className="font-bold text-3xl dark:text-white">
                    Interview Information
                  </h1>
                  <p className="font-bold dark:text-slate-400">
                    Date:{" "}
                    <span className="font-normal">
                      {application?.interviewDate}
                    </span>
                  </p>
                  <p className="font-bold dark:text-slate-400">
                    Time:{" "}
                    <span className="font-normal">
                      {application?.interviewTime}
                    </span>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Applications;
