import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../components/Card1.css";

const ApplicationSkeleton = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((item, i) => (
      <div className="flex flex-col mb-4 rounded-md justify-between gap-8 shadow-lg p-2 sm:p-12 dark:bg-slate-700">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          <div className="flex flex-row items-center justify-center gap-4 w-full">
            <Skeleton circle className="image-skeleton1" />
            <p className="text-lg sm:text-xl flex-grow">
              <Skeleton height={17} />
              <Skeleton height={17} />
            </p>
          </div>
        </div>
      </div>
    ));
};

export default ApplicationSkeleton;
