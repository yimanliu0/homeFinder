import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import "../styles/RegisterForm.css";

function RegisterForm(props) {
  const { register, handleSubmit, errors, watch } = useForm();
  const [errMsg, setErrMsg] = useState("");

  const onSubmit = (data) => {
    console.log(data);
    const url = "/signup";
    axios
      .post(url, data)
      .then((res) => {
        console.log("Register Success");
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
        const msg = "Unexpected Exception occurs";
        console.log(msg);
        setErrMsg(msg);
      });
  };

  return (
    <div className={"register-form"}>
      <form onSubmit={handleSubmit(onSubmit)} className={"register-form"}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="username"
            id="username"
            aria-label="Username"
            placeholder="Username (6 or more characters)"
            pattern="[A-Za-z0-9]{6,}"
            autoComplete="on"
            ref={register({ required: "Username required!" })}
          />
          {errors.username && (
            <p id="usernameError" style={{ color: "red" }}>
              {errors.username.message}
            </p>
          )}
        </div>
        <div className={"form-group"}>
          <input
            type={"password"}
            className={"form-control"}
            name={"password"}
            id={"password"}
            aria-label="Password"
            placeholder="Password (8 or more characters)"
            pattern=".{8,}"
            autoComplete="on"
            ref={register({ required: "Password required!" })}
          />
        </div>
        {errors.password && (
          <p id="passwordError" style={{ color: "red" }}>
            {errors.password.message}
          </p>
        )}
        <div className={"form-group"}>
          <input
            type={"password"}
            className={"form-control"}
            name={"confirm_password"}
            id={"confirm-password"}
            aria-label="confirm-password"
            placeholder="Confirm Password"
            pattern=".{8,}"
            autoComplete="on"
            ref={register({
              validate: (value) =>
                value === watch("password") || "Passwords does not match!",
            })}
          />
          {errors.confirm_password && (
            <p style={{ color: "red" }}>{errors.confirm_password.message}</p>
          )}
        </div>
        <button className="btn btn-primary" type={"submit"}>
          C R E A T E
        </button>
      </form>
      <p id="duplicatesError" style={{ color: "red" }}>
        {errMsg}
      </p>
      <a href="/">Already has an account? Log in</a>
    </div>
  );
}

export default RegisterForm;
