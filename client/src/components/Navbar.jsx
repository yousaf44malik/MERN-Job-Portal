import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { users } from "../utils/data";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../redux/userSlice";
import { FaBell } from "react-icons/fa";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Notification from "./Notification";
import "animate.css";
import "./Navbar.css";

function MenuList({ user, onClick }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("hasBeenShuffled");
    dispatch(Logout());
    window.location.replace("/");
  };

  return (
    <div>
      <Menu as="div" className="inline-block text-left">
        <div className="flex">
          <Menu.Button className="inline-flex p-4 gap-2 w-full rounded-md bg-white dark:text-white dark:bg-slate-700 dark:border md:px-4 py-2 text-sm font-medium text-slate-700 hover:bg-opacity-20 ">
            <div className="leading[80px] flex flex-col items-start">
              <p className="text-sm font-semibold ">
                {user?.firstName ?? user?.name}
              </p>
              <span className="text-sm text-blue-600 dark:text-white">
                {user?.jobTitle ?? user?.email}
              </span>
            </div>

            <img
              src={user?.profileUrl}
              alt="user profile"
              className="w-10 h-10 rounded-full object-cover "
            />
            <BiChevronDown
              className="h-8 w-8 text-slate-600 dark:text-white"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-50  mt-2 w-56 origin-top-right divide-y dividfe-gray-100 rounded-md bg-white shadow-lg focus:outline-none ">
            <div className="p-1 dark:bg-slate-800">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={`${
                      user?.accountType ? "user-profile" : "company-profile"
                    }`}
                    className={`${
                      active
                        ? "bg-blue-500 dark:bg-white dark:text-black text-white"
                        : "text-gray-900 dark:text-white"
                    } group flex w-full items-center rounded-md p-2 text-sm`}
                    onClick={onClick}
                  >
                    <CgProfile
                      className={`${
                        active
                          ? "text-white dark:text-slate-800"
                          : "text-gray-600 dark:text-white"
                      } mr-2 h-5 w-5  `}
                      aria-hidden="true"
                    />
                    {user?.accountType ? "User Profile" : "Company Profile"}
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleLogout()}
                    className={`${
                      active
                        ? "bg-blue-500 dark:bg-white dark:text-black text-whitewhite"
                        : "text-gray-900 dark:text-white"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <AiOutlineLogout
                      className={`${
                        active
                          ? "text-white dark:text-slate-800"
                          : "text-gray-600 dark:text-white"
                      } mr-2 h-5 w-5  `}
                      aria-hidden="true"
                    />
                    Log Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
const Navbar = ({ toggleTheme }) => {
  const location = useLocation();
  const isUserAuthPage = location.pathname === "/user-auth";
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openLargeModal, setOpenLargeModal] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const openauth = () => {
    if (window.location.href.includes("auth")) {
      window.location.reload();
    } else {
      navigate("/user-auth");
    }
  };

  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);
  };
  const theme1 = localStorage.getItem("theme");
  const modalClassNames = `custom-modal ${
    theme1 === "dark" ? "bg-slate-700" : ""
  }`;
  const smallModalClassNames = `custom-modal-small ${
    theme1 === "dark" ? "bg-slate-700" : ""
  }`;

  return (
    <>
      <div className="relative bg-[#f7fdfd]  dark:bg-slate-800 z-50 ">
        <nav className="container mx-auto flex items-center justify-between p-5">
          <div>
            <Link
              to="/"
              className="text-blue-600 dark:text-white font-bold text-xl animate__animated animate__fadeIn"
            >
              WORK
              <span className="text-[#1677cccb] dark:text-[#b9c4cecb]">
                EASE
              </span>
            </Link>
          </div>
          {user?.token && (
            <ul className="hidden lg:flex gap-10 text-base animate__animated animate__fadeIn">
              <li>
                <Link className="dark:text-white" to="/">
                  Find Job
                </Link>
              </li>
              <li>
                <Link className="dark:text-white" to="/companies">
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  className="dark:text-white"
                  to={
                    user?.accountType === "seeker"
                      ? "applications"
                      : "upload-job"
                  }
                >
                  {user?.accountType === "seeker"
                    ? "Applications"
                    : "Upload Job"}
                </Link>
              </li>

              <li>
                <Link className="dark:text-white" to="/job-news">
                  Job-News
                </Link>
              </li>
              <li>
                <Link className="dark:text-white" to="/about-us">
                  About
                </Link>
              </li>
            </ul>
          )}

          <div className="hidden lg:block animate__animated animate__fadeIn ">
            {!user?.token ? (
              <></>
            ) : (
              <div className="flex flex-auto justify-between items-center">
                <button
                  className="px-6 dark:text-white "
                  onClick={() => {
                    if (theme === "dark") {
                      localStorage.setItem("theme", "light");
                      toggleTheme("light");
                      setTheme("light");
                    } else {
                      localStorage.setItem("theme", "dark");
                      toggleTheme("dark");
                      setTheme("dark");
                    }
                  }}
                >
                  {localStorage.getItem("theme") === "dark" ? (
                    <MdLightMode className=" text-2xl" />
                  ) : (
                    <MdDarkMode className=" text-2xl" />
                  )}
                </button>
                {user?.accountType !== "seeker" && (
                  <FaBell
                    onClick={() => setOpenLargeModal(true)}
                    className="mr-6 text-2xl cursor-pointer  transition-transform transform hover:scale-110 dark:text-white"
                  />
                )}
                <Modal
                  classNames={{
                    modal: modalClassNames, // Specify your custom class name
                  }}
                  styles={{
                    modal: {
                      width: "80%",
                      maxWidth: "100%",
                      padding: "25px", // Adjust the width as needed
                      left: "4%",
                      top: "3.2rem",
                      bottom: "0", // Position the modal at the bottom
                      borderRadius: "10px",
                    },
                  }}
                  open={openLargeModal}
                  onClose={() => setOpenLargeModal(false)}
                >
                  <Notification />
                </Modal>
                <MenuList user={user} />
              </div>
            )}
          </div>
          {!user?.token && (
            <div className="flex flex-row">
              <div className="">
                <button
                  className="px-6 mt-2 dark:text-white "
                  onClick={() => {
                    if (window.innerWidth > 1000 && isUserAuthPage) {
                      window.location.reload();
                    }
                    if (theme === "dark") {
                      localStorage.setItem("theme", "light");
                      toggleTheme("light");
                      setTheme("light");
                    } else {
                      localStorage.setItem("theme", "dark");
                      toggleTheme("dark");
                      setTheme("dark");
                    }
                  }}
                >
                  {localStorage.getItem("theme") === "dark" ? (
                    <MdLightMode className=" text-2xl" />
                  ) : (
                    <MdDarkMode className=" text-2xl" />
                  )}
                </button>
              </div>
              <Link to="user-auth">
                <CustomButton
                  onClick={openauth}
                  title="Sign In"
                  containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
                />
              </Link>
            </div>
          )}
          {user?.token && (
            <div className="flex animate__animated animate__fadeIn">
              <button
                className="px-6 dark:text-white lg:hidden"
                onClick={() => {
                  if (theme === "dark") {
                    localStorage.setItem("theme", "light");
                    toggleTheme("light");
                    setTheme("light");
                  } else {
                    localStorage.setItem("theme", "dark");
                    toggleTheme("dark");
                    setTheme("dark");
                  }
                }}
              >
                {localStorage.getItem("theme") === "dark" ? (
                  <MdLightMode className=" text-2xl" />
                ) : (
                  <MdDarkMode className=" text-2xl" />
                )}
              </button>
              {user?.accountType !== "seeker" && (
                <FaBell
                  onClick={() => setOpenModal(true)}
                  className="text-2xl mr-8 mt-1 cursor-pointer lg:hidden  transition-transform transform hover:scale-110 dark:text-white"
                />
              )}
              <Modal
                classNames={{
                  modal: smallModalClassNames, // Specify your custom class name
                }}
                styles={{
                  modal: {
                    maxWidth: "600px", // Adjust the width as needed
                    top: "2.1rem",
                    bottom: "0", // Position the modal at the bottom
                    borderRadius: "10px",
                  },
                }}
                open={openModal}
                onClose={() => setOpenModal(false)}
              >
                <Notification />
              </Modal>
              <button
                className="block lg:hidden text-slate-900 dark:text-white"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {isOpen ? (
                  <AiOutlineClose size={26} />
                ) : (
                  <HiMenuAlt3 size={26} />
                )}
              </button>
            </div>
          )}
        </nav>

        {/* MOBILE MENU */}
        {user?.token && (
          <div
            className={`${
              isOpen
                ? " animate__animated animate__fadeInDown absolute flex bg-[#f7fdfd] dark:bg-slate-800 dark:text-white"
                : "hidden"
            } container mx-auto lg:hidden flex-col pl-8 gap-3 py-5`}
          >
            <Link to="/" onClick={handleCloseNavbar}>
              Find Job
            </Link>
            <Link to="/companies" onClick={handleCloseNavbar}>
              Companies
            </Link>
            <Link
              onClick={handleCloseNavbar}
              to={
                user?.accountType === "seeker" ? "applications" : "upload-job"
              }
            >
              {user?.accountType === "seeker" ? "Applications" : "Upload Job"}
            </Link>
            <Link to="/job-news" onClick={handleCloseNavbar}>
              Job-News
            </Link>
            <Link to="/about-us" onClick={handleCloseNavbar}>
              About
            </Link>

            <div className="w-full py-10">
              {!user?.token ? (
                <a href="/user-auth">
                  <CustomButton
                    onClick={openauth}
                    title="Sign In"
                    containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
                  />
                </a>
              ) : (
                <div>
                  <MenuList user={user} onClick={handleCloseNavbar} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
