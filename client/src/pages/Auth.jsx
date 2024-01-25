import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { office1, authvid, authlight } from "../assets";
import { SignUp } from "../components";
import "animate.css";

const Auth = () => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const theme = localStorage.getItem("theme");

  let from = location?.state?.from?.pathname || "/";

  if (user.token) {
    return window.location.replace(from);
  }
  useEffect(() => {
    document.title = "LogIn/SignUp";
  }, []);

  const isWideScreen = () => window.innerWidth >= 1000;

  const sourcevid = theme == "dark" ? authvid : authlight;
  return (
    <div className="w-full">
      {/*  */}
      {isWideScreen() ? (
        <video className="object-contain" autoPlay loop muted>
          <source src={sourcevid} type="video/mp4" />
        </video>
      ) : (
        <img
          src={office1}
          alt="Office"
          className="animate__animated animate__fadeInDown animate__fast-800ms object-contain  "
        />
      )}
      <SignUp open={open} setOpen={setOpen} />
    </div>
  );
};

export default Auth;
