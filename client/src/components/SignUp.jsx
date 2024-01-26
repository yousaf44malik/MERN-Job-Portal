import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { apiRequest } from "../utils";
import { Login } from "../redux/userSlice";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "animate.css";

const SignUp = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [accountType, setAccountType] = useState("seeker");
  // const [googleUser, setGoogleUser] = useState({})
  const theme = localStorage.getItem("theme");
  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  let from = location.state?.from?.pathname || "/";

  const closeModal = () => setOpen(false);
  function isValidEmail(email) {
    // Regular expression to match valid email addresses
    var emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|aol|protonmail|icloud)\.(com|net|org|edu|co\.uk|info)$/i;

    return emailRegex.test(email);
  }
  const onSubmit = async (data) => {
    let URL = null;
    if (isRegister) {
      if (accountType === "seeker") URL = "auth/register";
      else URL = "companies/register";
    } else {
      if (accountType === "seeker") URL = "auth/login";
      else URL = "companies/login";
    }
    if (!isValidEmail(data.email)) {
      toast.dismiss();
      toast.error("Invalid email.", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    if (isRegister && data.firstName.length < 1) {
      toast.dismiss();
      toast.error("Invalid First name", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }
    if (isRegister && data.lastName.length < 1) {
      toast.dismiss();
      toast.error("Invalid Last name", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }
    if (isRegister && data.password.length < 8) {
      toast.dismiss();
      toast.error("Password must be at least 8 characters long.", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    if (isRegister && !/[A-Z]/.test(data.password)) {
      toast.dismiss();
      toast.error("Password must contain at least one uppercase letter.", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    if (isRegister && !/[a-z]/.test(data.password)) {
      toast.dismiss();
      toast.error("Password must contain at least one lowercase letter.", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }
    if (isRegister && !/\d/.test(data.password)) {
      toast.dismiss();
      toast.error("Password must contain at least one digit.", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }
    if (isRegister && !/[$@$!%*?&]/.test(data.password)) {
      toast.dismiss();
      toast.error(
        "Password must contain at least one special character (e.g., $, @, !, %, *, ?, &).",
        {
          position: "top-center",
          duration: 3000,
        }
      );
      return;
    }
    if (isRegister) {
      if (accountType === "seeker") URL = "auth/register";
      else URL = "companies/register";
    } else {
      if (accountType === "seeker") URL = "auth/login";
      else URL = "companies/login";
    }

    try {
      const res = await apiRequest({
        url: URL,
        data: data,
        method: "POST",
      });
      console.log(res);
      if (res?.status === "falied") {
        setErrMsg(res?.message);
        toast.dismiss();
        toast.error(res?.message, {
          position: "top-center",
          duration: 3000,
        });
      } else {
        setErrMsg("");
        const data = { token: res?.token, ...res?.user };
        dispatch(Login(data));
        localStorage.setItem("userInfo", JSON.stringify(data));
        window.location.replace(from);
        //don't remove this code yet to be handled.
        // if (isRegister) {
        //   toast.success("Registeration successful!", {
        //     duration: 2000,
        //     position: "top-right",
        //   });
        // } else {
        //   toast.success("LogIn successful!", {
        //     duration: 2000,
        //     position: "top-right",
        //   });
        // }
      }
    } catch (error) {
      toast.dismiss();
      if (isRegister) {
        toast.error("Registeration Failed!", {
          position: "top-center",
          duration: 3000,
        });
      } else {
        toast.error("SignIn Failed!", {
          position: "top-center",
          duration: 3000,
        });
      }
    }
  };

  const handleGoogleLogin = async (codeResponse) => {
    const googleUser = jwtDecode(codeResponse.credential);
    let firstName, lastName;
    const nameArray = googleUser.name.split(" ");
    firstName = nameArray[0];
    lastName = nameArray[1];
    const res = await axios.post(
      "https://workease-server-woad.vercel.app/api-v1/auth/google-sign-in",
      {
        email: googleUser.email,
        firstName: firstName,
        lastName: lastName,
        profileUrl: googleUser.picture,
      }
    );
    if (res?.status === "falied") {
      setErrMsg(res?.message);
      toast.dismiss();
      toast.error(res?.message, {
        position: "top-center",
        duration: 3000,
      });
    } else {
      setErrMsg("");
      const data = { token: res?.data?.token, ...res?.data?.user };
      dispatch(Login(data));
      localStorage.setItem("userInfo", JSON.stringify(data));
      window.location.replace(from);
    }
  };

  return (
    <>
      <Transition appear show={open || false}>
        <Dialog as="div" className="relative z-10  " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0  bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`${
                    theme === "dark"
                      ? "animate__animated animate__fadeIn animate__delay-1s w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all bg-slate-800"
                      : "animate__animated animate__fadeIn animate__delay-1s w-full max-w-md transform overflow-hidden rounded-2xl bg-white  p-6 text-left align-middle shadow-xl transition-all "
                  }`}
                >
                  <Dialog.Title
                    as="h3"
                    className={`${
                      theme === "dark"
                        ? "text-xl font-semibold lwading-6  text-white"
                        : "text-xl font-semibold lwading-6 text-gray-900"
                    }`}
                  >
                    {isRegister ? "Create Account" : "Account Sign In"}
                  </Dialog.Title>

                  <div className="w-full flex items-center justify-center py-4 ">
                    <button
                      className={`flex-1 px-4 py-2 rounded text-sm outline-none  ${
                        accountType === "seeker"
                          ? theme === "dark"
                            ? "bg-white text-slate-700 border border-white"
                            : "bg-white border border-blue-400"
                          : theme === "dark"
                          ? "bg-slate-700 text-white"
                          : "bg-[#1d4fd862] text-blue-900 font-semibold"
                      }   `}
                      onClick={() => {
                        setErrMsg("");
                        setAccountType("seeker");
                        document.getElementById("form-login").reset();
                      }}
                    >
                      User Account
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded text-sm outline-none
                       ${
                         accountType !== "seeker"
                           ? theme === "dark"
                             ? "bg-white text-slate-700 border border-white"
                             : "bg-white border border-blue-400"
                           : theme === "dark"
                           ? "bg-slate-700 text-white"
                           : "bg-[#1d4fd862] text-blue-900 font-semibold"
                       } 
                     `}
                      onClick={() => {
                        setErrMsg("");
                        setAccountType("company");
                        document.getElementById("form-login").reset();
                      }}
                    >
                      Company Account
                    </button>
                  </div>

                  <form
                    className="w-full flex flex-col gap-5"
                    id="form-login"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <TextInput
                      name="email"
                      label="Email Address"
                      placeholder="email@example.com"
                      type="email"
                      register={register("email", {
                        required: "Email Address is required!",
                      })}
                      error={errors.email ? errors.email.message : ""}
                    />

                    {isRegister && (
                      <div className="w-full flex gap-1 md:gap-2">
                        <div
                          className={`${
                            accountType === "seeker" ? "w-1/2" : "w-full"
                          }`}
                        >
                          <TextInput
                            name={
                              accountType === "seeker" ? "firstName" : "name"
                            }
                            label={
                              accountType === "seeker"
                                ? "First Name"
                                : "Company Name"
                            }
                            placeholder={
                              accountType === "seeker"
                                ? "eg. James"
                                : "Comapy name"
                            }
                            type="text"
                            register={register(
                              accountType === "seeker" ? "firstName" : "name",
                              {
                                required:
                                  accountType === "seeker"
                                    ? "First Name is required"
                                    : "Company Name is required",
                              }
                            )}
                            error={
                              accountType === "seeker"
                                ? errors.firstName
                                  ? errors.firstName?.message
                                  : ""
                                : errors.name
                                ? errors.name?.message
                                : ""
                            }
                          />
                        </div>

                        {accountType === "seeker" && isRegister && (
                          <div className="w-1/2">
                            <TextInput
                              name="lastName"
                              label="Last Name"
                              placeholder="Wagonner"
                              type="text"
                              register={register("lastName", {
                                required: "Last Name is required",
                              })}
                              error={
                                errors.lastName ? errors.lastName?.message : ""
                              }
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="w-full flex gap-1 md:gap-2">
                      <div className={`${isRegister ? "w-1/2" : "w-full"}`}>
                        <TextInput
                          name="password"
                          label="Password"
                          placeholder="Password"
                          type="password"
                          register={register("password", {
                            required: "Password is required!",
                          })}
                          error={
                            errors.password ? errors.password?.message : ""
                          }
                        />
                      </div>

                      {isRegister && (
                        <div className="w-1/2">
                          <TextInput
                            label="Confirm Password"
                            placeholder="Password"
                            type="password"
                            register={register("cPassword", {
                              validate: (value) => {
                                const { password } = getValues();

                                if (password != value) {
                                  return "Passwords do no match";
                                }
                              },
                            })}
                            error={
                              errors.cPassword &&
                              errors.cPassword.type === "validate"
                                ? errors.cPassword?.message
                                : ""
                            }
                          />
                        </div>
                      )}
                    </div>

                    {errMsg && (
                      <span
                        role="alert"
                        className="text-sm text-red-500 mt-0.5"
                      >
                        {errMsg}
                      </span>
                    )}

                    <div className="mt-2">
                      <CustomButton
                        type="submit"
                        containerStyles={`${
                          theme === "dark"
                            ? "inline-flex justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white outline-none hover:bg-blue-800 bg-slate-700 border border-white hover:bg-white hover:text-slate-700"
                            : "inline-flex justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white outline-none hover:bg-blue-800"
                        }`}
                        title={isRegister ? "Create Account" : "Login Account"}
                      />
                    </div>

                    {accountType === "seeker" && (
                      <div className=" mt-2 flex flex-col gap-y-3 items-center align-center">
                        <p
                          className={`${
                            theme === "dark" ? "  text-white" : ""
                          }`}
                        >
                          OR
                        </p>
                        <GoogleLogin
                          className="w-full "
                          onSuccess={handleGoogleLogin}
                          onError={() => {
                            console.log("Login Failed");
                          }}
                          useOneTap
                        />
                      </div>
                    )}
                  </form>

                  <div className="mt-4">
                    <p
                      className={`${
                        theme === "dark"
                          ? "text-sm   text-white"
                          : "text-sm text-gray-700"
                      }`}
                    >
                      {isRegister
                        ? "Already has an account?"
                        : "Do not have an account"}

                      <span
                        className={`${
                          theme === "dark"
                            ? "text-sm text-blue-200 ml-2 hover:text-blue-400 hover:font-semibold cursor-pointer"
                            : "text-sm text-blue-600 ml-2 hover:text-blue-700 hover:font-semibold cursor-pointer"
                        }`}
                        onClick={() => {
                          setIsRegister((prev) => !prev);
                          document.getElementById("form-login").reset();
                        }}
                      >
                        {isRegister ? "Login" : "Create Account"}
                      </span>
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Toaster />
    </>
  );
};

export default SignUp;
