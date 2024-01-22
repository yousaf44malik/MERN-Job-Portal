import { useEffect } from "react";
import React from "react";
import { JobImg, Home } from "../assets";

const About = () => {
  useEffect(() => {
    document.title = "About";
  }, []);
  return (
    <div className="p-2 sm:p-20 md:p-28 flex flex-col gap-8 2xl:gap-14 py-6 dark:bg-slate-800">
      <div className="w-full flex flex-col-reverse lg:flex-row gap-10 items-center p-5">
        <div className="w-full md:2/3 2xl:w-2/4">
          <h1 className=" text-3xl text-blue-600 font-bold mb-5 dark:text-white">
            About Us
          </h1>
          <p className="text-justify leading-7 dark:text-slate-400">
            Our web project revolutionizes the job-seeking experience with a
            comprehensive job portal. Developed with meticulous attention to
            detail, our platform seamlessly connects employers and job seekers,
            streamlining the recruitment process for a more efficient and
            user-friendly experience. The portal boasts robust features,
            including user and company account management, where individuals and
            organizations can create and manage their profiles with ease. To
            enhance user convenience, we've implemented Google authentication,
            ensuring a secure and hassle-free login process.
          </p>
        </div>
        <img src={Home} alt="About" className="w-auto h-[300px]" />
      </div>

      <div className="leading-8 px-5 text-justify dark:text-slate-400">
        <p>
          Employers can effortlessly upload job listings, providing detailed
          descriptions to attract the right candidates. Job seekers, on the
          other hand, can explore a dedicated jobs view page, where they can
          browse through a myriad of opportunities tailored to their skills and
          preferences. The platform also includes a unique Job News section,
          aggregating the latest industry updates through tweets sourced from
          Twitter, keeping users informed and engaged with the pulse of the job
          market. User profiles offer a personalized space for individuals to
          showcase their professional journey, skills, and achievements.
          Simultaneously, company profiles provide organizations with a
          dedicated space to present their culture, values, and open positions.
          To keep users informed and engaged, our platform incorporates
          application notifications, ensuring that job seekers receive timely
          updates on their job applications. This feature helps bridge the
          communication gap between employers and applicants, fostering a more
          transparent and efficient recruitment process.
        </p>
      </div>
    </div>
  );
};

export default About;
