import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Footer, Navbar } from "./components";
import {
  About,
  AuthPage,
  Companies,
  CompanyProfile,
  FindJobs,
  JobDetail,
  UploadJob,
  UserProfile,
} from "./pages";
import { useSelector } from "react-redux";
import JobNews from "./pages/JobNews";
import Apply from "./pages/Apply";
import { SkeletonTheme } from "react-loading-skeleton";
import Applications from "./pages/Applications";
import { useState } from "react";
import ScrollToTop from "./components/ScrollToTop";
import FindFreeJobs from "./pages/FindFreeJobs";
import JobDetailFree from "./pages/JobDetailFree";
import NotFound from "./pages/NotFound";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Routes>
      <Route
        path="/"
        element={<FindFreeJobs />} // Render FindJobs component for home when user is not present
      />

      {/* <Navigate to="/user-auth" state={{ from: location }} replace /> */}
    </Routes>
  );
}

function App() {
  const { user } = useSelector((state) => state.user);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = (theme) => {
    setTheme(theme);
  };
  return (
    <main
      className={`${
        theme === "dark" ? "dark" : ""
      } bg-[#f7fdfd] dark:bg-slate-800`}
    >
      <SkeletonTheme baseColor="#e6e6e6" highlightColor="#b8b8b8">
        <Navbar toggleTheme={toggleTheme} />

        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={<Navigate to="/find-jobs" replace={true} />}
            />
            <Route path="/find-jobs" element={<FindJobs />} />
            <Route path="/companies" element={<Companies />} />
            <Route
              path={
                user?.accountType === "seeker"
                  ? "/user-profile"
                  : "/user-profile"
              }
              element={<UserProfile />}
            />

            <Route path={"/company-profile"} element={<CompanyProfile />} />
            <Route path={"/company-profile/:id"} element={<CompanyProfile />} />
            <Route path={"/upload-job"} element={<UploadJob />} />
            <Route path={"/applications"} element={<Applications />} />
            <Route path={"job-news"} element={<JobNews />} />

            <Route path={"/job-detail/:id"} element={<JobDetail />} />
            <Route path={"/apply/:id"} element={<Apply />} />
          </Route>
          <Route
            path="/jobs-detail/:id"
            element={<JobDetailFree />} // Render FindJobs component for home when user is not present
          />
          <Route path="/about-us" element={<About />} />

          <Route path="/user-auth" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
        {user && <Footer />}
      </SkeletonTheme>
    </main>
  );
}

export default App;
