import { GoLocation } from "react-icons/go";
import moment from "moment";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const JobCard = ({ job }) => {
  return (
    <Link to={`/job-detail/${job?._id}`}>
      <div
        className="w-full md:w-[16rem] 2xl:w-[18rem] h-[16rem] md:h-[18rem] bg-white dark:bg-slate-700 flex flex-col justify-between shadow-lg 
                rounded-md px-3 py-5 "
      >
        <div className="w-ful h-full flex flex-col justify-center">
          <div className="flex gap-3">
            <img src={job?.logo} alt={job?.name} className="w-14 h-14 rounded-lg" />

            <div className="w-full h-16 flex flex-col justify-center">
              <p className="w-full h-12 flex items-center overflow-hidden leading-5 text-lg font-semibold dark:text-white">
                {job?.jobTitle}
              </p>
              <span className="flex gap-2 items-center dark:text-slate-400">
                <GoLocation className="text-slate-900 text-sm dark:text-slate-400" />
                {job?.location}
              </span>
            </div>
          </div>

          <div className="py-3">
            <p className="text-sm dark:text-slate-400">
              {job?.detail[0]?.desc?.slice(0, 150) + "..."}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="bg-[#1d4fd826] text-[#1d4fd8] dark:bg-[#1d4fd8] dark:text-white py-0.5 px-1.5 rounded font-semibold text-sm">
              {job?.jobType}
            </p>
            <span className="text-gray-500 text-sm dark:text-slate-400">
              {moment(job?.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
