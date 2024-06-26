import axios from "axios";
import { message } from "antd";

export const userLogin = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await axios.post(
      "http://localhost:8000/api/users/login",
      reqObj
    );
    console.log(response);
    const { admin, username, _id } = response.data;
    localStorage.setItem("user", JSON.stringify({ admin, username, _id }));
    message.success("Login success");
    dispatch({ type: "LOADING", payload: false });
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  } catch (error) {
    console.log(error);
    message.error("Something went wrong");
    dispatch({ type: "LOADING", payload: false });
  }
};

export const userRegister = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });
  
  try {
    console.log("register");
    const response = await axios.post(
      "http://localhost:8000/api/users/register",
      reqObj
    );
    console.log(response)
    message.success("Registration successfull");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
    
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.log(error);
    message.error("Something went wrong");
    dispatch({ type: "LOADING", payload: false });
  }
};
export const verifyUser = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });
  
  try {
    console.log("verify");
    const response = await axios.post(
      "http://localhost:8000/api/users/verifyuser",
      reqObj
    );
    
    message.success("Verification successfull");
    console.log(response)
    const { admin, username, _id, isVerifiedUser } = response.data;
    localStorage.setItem("user", JSON.stringify({admin, username, _id, isVerifiedUser}))
    setTimeout(() => {
      window.location.href = `/booking/${reqObj.car}`;
    }, 1000);

    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.log(error);
    message.error("Something went wrong");
    dispatch({ type: "LOADING", payload: false });
  }
};
