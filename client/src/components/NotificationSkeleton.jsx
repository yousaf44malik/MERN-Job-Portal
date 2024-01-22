import React from "react";
import "./Card1.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const NotificationSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-8">
      <div className="flex flex-row items-center justify-center gap-4 w-full">
        <Skeleton circle className="image-skeleton1" />
        <p className="text-lg sm:text-xl flex-grow">
          <Skeleton height={17} />
          <Skeleton height={17} />
        </p>
      </div>
    </div>
  );
};
