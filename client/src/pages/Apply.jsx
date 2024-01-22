import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  CustomButton,
  JobCard,
  JobTypes,
  TextInput,
  Loading,
} from "../components";
import { apiRequest } from "../utils";
import { useSelector } from "react-redux";
import "./Apply.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Login } from "../redux/userSlice";

const Apply = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [resumeFile, setFile] = useState([]);
  const navigate = useNavigate();
  const getJobDetails = async () => {
    setIsFetching(true);

    try {
      const res = await apiRequest({
        url: "/jobs/get-job-detail/" + id,
        method: "GET",
      });

      setJob(res?.data);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(user);
    setAppliedFunction();
    id && getJobDetails();
    document.title = "Apply for job";
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);
  const label = `Are you legally authorized to work in ${job?.location}?`;

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const [errMsg, setErrMsg] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [isLoading, setIsLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const onSubmit = async (data) => {
    console.log(data);
    console.log(user);
    const filename = `${user.email}-resume-${id}.pdf`;
    const formData = new FormData();
    const applicantName = `${user.firstName} ${user.lastName}`;
    const userPhoto = user.profileUrl;

    if (resumeFile) {
      formData.append("file", resumeFile);

      try {
        const response = await axios.post(
          `https://workease-server-woad.vercel.app/upload?fileName=${filename}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setIsLoading(true);
    setErrMsg(null);

    const newData = {
      ...data,
      jobId: id,
      filename: filename,
      applicantName: applicantName,
      userPhoto: userPhoto,
      status: "pending",
      interviewTime: "",
      user: { userId: user._id },
    };
    console.log(newData);

    try {
      console.log(user);
      const res = await apiRequest({
        url: `/jobs/job-application`,
        data: newData,
        method: "POST",
      });
      if (res.status === "failed") {
        setErrMsg({ ...res });
      } else {
        setErrMsg({ status: "success", message: res.message });
        toast.success("Application sent. Redirecting to Home page!", {
          position: "top-center",
          duration: 3000,
        });
        const userDataString = localStorage.getItem("userInfo");
        const userData = JSON.parse(userDataString);
        userData.applications.push(id);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        updateUserApplications();
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      console.log(newData);
      setIsLoading(false);
    }
  };

  const setAppliedFunction = () => {
    user?.applications?.map((jobId) => {
      if (jobId === id) setHasApplied(true);
    });
  };

  const updateUserApplications = async () => {
    console.log("Update User Applications");
    const jobId = id;

    try {
      const res = await apiRequest({
        url: "/users/update-user",
        token: user?.token,
        data: { jobId },
        method: "PUT",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fileInputRef = useRef(null);

  const handleFileChange = () => {
    const selectedFile = fileInputRef.current.files[0];
    if (selectedFile) {
      const maxSizeInBytes = 2 * 1024 * 1024;
      if (selectedFile.size > maxSizeInBytes) {
        toast.error("File too Large! Max Limit is 2mb", {
          position: "top-center",
          duration: 3000,
        });
        fileInputRef.current.value = "";
      } else {
        setFile(selectedFile);
      }
    }
  };

  return (
    <div className="w-full dark:bg-slate-800">
      <div className="dark:bg-slate-800 container mx-auto flex flex-col justify-center md:flex-row gap-8 2xl:gap-14 bg-[#f7fdfd] px-5">
        <div className="dark:bg-slate-700 rounded-md w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-10 md:px-10 shadow-md">
          <div>
            <p className="flex justify-center mb-6 dark:text-white text-gray-500 font-semibold text-2xl">
              Application for {job?.jobTitle}
            </p>
            <div className="flex flex-row ">
              <img
                src={job?.company?.profileUrl}
                alt={job?.company?.name}
                className="w-20 h-20 md:w-24 md:h-20 rounded"
              />
              <div className="flex flex-col ml-4">
                <span className="text-base dark:text-white">
                  {job?.location}
                </span>

                <span className="text-base dark:text-white text-gray-600">
                  {job?.company?.name}
                </span>

                <span className="dark:text-white text-gray-500 text-sm">
                  Posted {moment(job?.createdAt).fromNow()}
                </span>
                <Link to={`/job-detail/${id}`}>
                  <span className="text-blue-500 text-sm  hover:underline dark:text-white">
                    More details
                  </span>
                </Link>
              </div>
            </div>

            <form
              className="w-full mt-2 flex flex-col gap-8"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="w-full flex gap-4">
                <div className="w-full">
                  <TextInput
                    name="fluent"
                    label="Are you fluent in English?"
                    placeholder="Yes/No"
                    type="text"
                    register={register("fluent", {
                      required: "This field is required",
                    })}
                    error={errors.fluent ? errors.fluent?.message : ""}
                  />
                </div>
              </div>
              <div className="w-full flex gap-4">
                <div className="w-full">
                  <TextInput
                    name="worklegal"
                    label={label}
                    placeholder="Yes/No"
                    type="text"
                    register={register("worklegal", {
                      required: "This field is required",
                    })}
                    error={errors.worklegal ? errors.worklegal?.message : ""}
                  />
                </div>
              </div>

              <div className="w-full flex gap-4">
                <div className="w-full">
                  <TextInput
                    name="start"
                    label="Are you available to start immediately?"
                    placeholder="Yes/No"
                    type="text"
                    register={register("start", {
                      required: "This field is required",
                    })}
                    error={errors.start ? errors.start?.message : ""}
                  />
                </div>
              </div>

              <div className="w-full flex gap-4">
                <div className="w-full">
                  <TextInput
                    name="linkedin"
                    label="LinkedIn URL"
                    placeholder="https://linkedin.com/in/example"
                    type="text"
                    register={register("linkedin", {})}
                    error={errors.linkedin ? errors.linkedin?.message : ""}
                  />
                </div>
              </div>
              <div className="w-full flex gap-4">
                <div className="w-full">
                  <TextInput
                    name="salary"
                    label="What was your previous salary?"
                    placeholder=""
                    type="number"
                    register={register("salary", {})}
                    error={errors.salary ? errors.salary?.message : ""}
                  />
                </div>
              </div>
              <div className="w-full flex gap-4">
                <div className="w-full">
                  <input
                    name="resume"
                    className="mt-4"
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onInput={handleFileChange}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 dark:text-white text-sm mb-1">
                  Cover Letter
                </label>
                <textarea
                  required
                  className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                  rows={4}
                  cols={6}
                  {...register("coverletter", {
                    required: "Job Description is required!",
                  })}
                  aria-invalid={errors.desc ? "true" : "false"}
                ></textarea>
                {/* {errors.desc && (
                <span role="alert" className="text-xs text-red-500 mt-0.5">
                  {errors.desc?.message}
                </span>
              )} */}
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 dark:text-white text-sm mb-1">
                  Additional Comments
                </label>
                <textarea
                  className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                  rows={4}
                  cols={6}
                  {...register("comments")}
                ></textarea>
              </div>

              {/* {errMsg && (
              <span role="alert" className="text-sm text-red-500 mt-0.5">
                {errMsg}
              </span>
            )} */}
              <div className="mt-2">
                {isLoading ? (
                  <Loading />
                ) : !hasApplied ? (
                  <CustomButton
                    type="submit"
                    containerStyles="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none dark:hover:bg-white dark:hover:text-black"
                    title="Apply"
                  />
                ) : (
                  <p className="dark:text-white font-semibold">
                    Already Applied
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default Apply;
