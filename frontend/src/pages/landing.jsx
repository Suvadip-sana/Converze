// import React from 'react'
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
export default function landing() {

  const router = useNavigate();
  let [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  function meetingCodeGenerator() {
    const chars = "abcdefghijkmnopqrstuvwxyz123456789";

    const randomPart = (length) => {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const code = `${randomPart(6)}-${randomPart(6)}-${randomPart(6)}`;

    return code;
  }

  const handleGuest = () => {
    const randomHref = meetingCodeGenerator(); 
    router(`/${randomHref}`);
  }

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router("/home");
    } else {
      router("/auth");
    }
  }

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  return (
    <div className="landing-page-container">

      <nav className="nav-outer">
        <div className="nav-header" onClick={() => { router("/") }}>
          {/* <img className="l-page-nav-logo" srcSet="/converze.png" alt="" /> */}
          {/* <h2>Converze</h2> */}
          <span>C</span>
          <img className='o-logo' srcSet="/t-logo.avif" alt="" />
          <span>nverz</span>
          {/* <img className="gif" src="/gif.gif" alt=""></img> */}
        </div>
        <div className="nav-lists">
          <p onClick={handleGuest}>Join as Guest</p>
          <p onClick={() => { router("/auth") }} >Register</p>
          {isAuthenticated ?
            <div role="button" className="login-btn">
              <p onClick={handleLogOut}>Log out</p>
            </div>
            :
            <div role="button" className="login-btn">
              <p onClick={() => { router("/auth") }} >Log in</p>
            </div>
          }
        </div>
      </nav>

      <div className="landing-main-container">
        <div className="left">
          <h2><span>Connect</span> with your loved Ones</h2>
          <p>Cover a distance by Converze</p>
          <div role="button" className="started-btn" onClick={handleGetStarted}>
            <p>Get Started</p>
          </div>
        </div>
        <div className="right">
          <img src="/mobiles.avif" alt="" />
        </div>
      </div>

    </div>
  )
}
