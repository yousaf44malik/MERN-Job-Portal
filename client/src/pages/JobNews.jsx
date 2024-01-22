import React, { useEffect, useState } from "react";
import "./Jobnews.css";
import { Tweet } from "react-tweet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { JobCard, Loading } from "../components";
import CompanyNewscard from "../components/CompanyNewscard";
import { apiRequest } from "../utils";
import CardSkeleton from "../components/CardSkeleton";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const JobNews = () => {
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchJobs = async () => {
    setIsFetching(true);
    try {
      const res = await apiRequest({
        url: "jobs/find-jobs",
        method: "GET",
      });

      setData(res?.data);
      setTimeout(() => {
        setIsFetching(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompanies = async () => {
    setIsFetching(true);
    try {
      const res = await apiRequest({
        url: "companies",
        method: "GET",
      });

      setCompanies(res?.data);
      setRecordsCount(res?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "Job-News";
    fetchJobs();
    fetchCompanies();
  }, []);

  return (
    <div className="dark:bg-slate-800">
      <div className="header-div">
        <p className="text-slate-700 dark:text-white font-bold text-4xl job-news-header">
          Find the Latest Job News from &nbsp;
          <FontAwesomeIcon
            className="twit-icon"
            icon="fa-brands fa-square-x-twitter"
          />
          &nbsp; here
        </p>
      </div>
      <div className="news-div-main">
        <div className="recent-div">
          {" "}
          <div className="w-full md:w-1.5/3 2xl:2/4 p-5 mt-20 md:mt-0">
            <p className="text-gray-500 font-semibold mb-6 recent-p">
              Recent Listings
            </p>

            <div className="w-full flex flex-wrap gap-6">
              {isFetching && <CardSkeleton cards={5} />}
              {!isFetching &&
                data
                  .slice(data.length - 9, data.length - 1)
                  .map((job, index) => {
                    const newJob = {
                      name: job?.company?.name,
                      logo: job?.company?.profileUrl,
                      ...job,
                    };
                    return <JobCard job={newJob} key={index} />;
                  })}
            </div>
          </div>
        </div>
        <div className="news-div">
          <Tweet id="1737767800213750113" />
          <Tweet id="1737850488329310490" />
          <Tweet id="1492015603594502158" />
          <Tweet id="1623306369926418433" />
          <Tweet id="1635695756232527879" />
          <Tweet id="1686327098716078080" />
          <Tweet id="1662002396048809984" />
          <Tweet id="1648316417899479044" />
          <Tweet id="1699814786517664238" />
        </div>
        <div className="flex flex-col gap-6 companies-div">
          <p className="text-gray-500 font-semibold">Companies</p>
          {companies?.map((cmp, index) => (
            <CompanyNewscard cmp={cmp} key={index} />
          ))}

          {isFetching && (
            <div className="mt-10">
              <Loading />
            </div>
          )}

          <p className="text-sm text-right dark:text-white">
            {data?.length} records out of {data?.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobNews;
