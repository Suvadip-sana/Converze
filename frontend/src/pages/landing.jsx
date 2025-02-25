// import React from 'react'
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
export default function landing() {

  const router = useNavigate();
  let [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleGuest = () => {
    const randomHref = Math.random().toString(36).substr(2, 10); //Converts a random number to a base-36 string (letters + numbers) and substr(2, 10): Removes the "0." at the start and keeps 10 random characters.
    router(`/${randomHref}`);
  }

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const handleGetStarted = () => {
    if(isAuthenticated){
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
        <div className="nav-header">
          <h2>Converze</h2>
        </div>
        <div className="nav-lists">
          <p onClick={handleGuest}>Join as Guest</p>
          <p onClick={() => { router("/auth")}} >Register</p>
          { isAuthenticated ? 
            <div role="button" className="login-btn">
              <p onClick={handleLogOut}>Log out</p>
            </div>
          :
            <div role="button" className="login-btn">
              <p onClick={() => { router("/auth")}} >Log in</p>
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
          <img src="/mobiles.png" alt="" />
        </div>
      </div>
      
    </div>
  )
}
