import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

function Login(props) {
  const [loginError, setLoginError] = useState("");

  const page = "#"; // generally not good to use globals in js, but for a small use case should work ok

  const handleLoginClick = (e) => {
    e.preventDefault();
    const url = "/signin";
    const body = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };
    axios
      .post(url, body)
      .then((res) => {
        console.log(res);
        console.log(`User ${res.data.username} Log in success!`);
        props.setUser(res.data);
      })
      .catch((error) => {
        console.log("there is error");
        if (error.response.data) {
          setLoginError(error.response.data);
        } else {
          const msg = "Unexpected Exception occurs";
          console.log(msg);
          setLoginError(msg);
        }
      });
  };

  return (
    <div className="login-container" id="login-form">
      <form>
        <input
          id="username"
          name="username"
          type="text"
          aria-label="Username"
          autoComplete="on"
          placeholder={"Username"}
        />
        <br />
        <br />
        <input
          id="password"
          aria-labelledby="password"
          name="password"
          type="password"
          aria-label="Password"
          autoComplete="on"
          placeholder={"Password"}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className={"button-placeholder"}>
            <button
              className="btn btn-primary"
              onClick={handleLoginClick}
              id="login-button"
            >
              Login
            </button>
          </div>
        </div>
        <div className="mt-4">
          <div className="d-flex justify-content-center links">
            Don't have an account?{" "}
            <a
              href={page}
              className="ml-2"
              onClick={() => props.setRegister(true)}
              id="signup-link"
            >
              Sign Up
            </a>
          </div>
          <div className="d-flex justify-content-center links"></div>
        </div>
        <p id="login-error">{loginError}</p>
        {/* {error ? <div className="danger">{error}</div> : ''} */}
      </form>
    </div>
  );
}

export default Login;
