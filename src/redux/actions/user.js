import Axios from "axios";
import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user";
import passwordHash from "password-hash";
import swal from "sweetalert";

const {
  ON_USER_INPUT,
  ON_LOGIN_FAIL,
  ON_LOGIN_SUCCESS,
  ON_LOGOUT_SUCCESS,
} = userTypes;

const cookieObj = new Cookie();

export const userInputHandler = (text) => {
  return {
    type: ON_USER_INPUT,
    payload: text,
  };
};

export const loginHandler = (userData) => {
  return (dispatch) => {
    const { username, password, lastLogin } = userData;

    Axios.get(`${API_URL}/users`, {
      params: {
        username,
      },
    }).then((res) => {
      if (res.data.length > 0) {
        if (passwordHash.verify(password, res.data[0].password)) {
          swal("Yeay!", "Login berhasil", "success");
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data[0],
          });
          Axios.patch(`${API_URL}/users/${res.data[0].id}`, {
            lastLogin,
          });
        } else {
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: "Passweord salah",
          });
        }
      } else {
        dispatch({
          type: ON_LOGIN_FAIL,
          payload: "Username salah",
        });
      }
    });
  };
};

export const userKeepLogin = (userData) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        id: userData.id,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data[0],
          });
        } else {
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: "Username atau password salah",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const logoutHandler = () => {
  cookieObj.remove("authData");
  return {
    type: ON_LOGOUT_SUCCESS,
  };
};

export const registerHandler = (userData) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        username: userData.username,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          dispatch({
            type: "ON_REGISTER_FAIL",
            payload: "Username sudah digunakan",
          });
        } else {
          Axios.get(`${API_URL}/users`, {
            params: {
              email: userData.email,
            },
          })
            .then((res) => {
              if (res.data.length > 0) {
                dispatch({
                  type: "ON_REGISTER_FAIL",
                  payload: "Email sudah digunakan",
                });
              } else {
                Axios.post(`${API_URL}/users`, userData)
                  .then((res) => {
                    console.log(res.data);
                    dispatch({
                      type: ON_LOGIN_SUCCESS,
                      payload: res.data,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const editUserHandler = (id, userData) => {
  return (dispatch) => {
    const { username, address, phone } = userData;
    Axios.get(`${API_URL}/users/`, {
      params: {
        username,
      },
    })
      .then((res) => {
        if (!res.data[0]) {
          Axios.patch(`${API_URL}/users/${id}`, {
            username,
            address,
            phone,
          })
            .then((res) => {
              swal("Yeay!", "Update data berhasil", "success");
              dispatch({
                type: ON_LOGIN_SUCCESS,
                payload: res.data,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          swal("Oops...", `Username ${username} sudah dipakai`, "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const editPasswordHandler = (id, username, passwordOld, passwordNew) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users/`, {
      params: {
        username,
      },
    })
      .then((res) => {
        alert("Masuk sini bang");
        if (passwordHash.verify(passwordOld, res.data[0].password)) {
          Axios.patch(`${API_URL}/users/${id}`, {
            password: passwordHash.generate(passwordNew),
          }).then((res) => {
            swal("Yeay!", "password berhasil diganti", "success");
          });
        } else {
          swal("Oops...", "Password lama anda salah lur", "error");
        }
      })
      .catch((err) => {
        swal("Oops...", "Something went wrong", "error");
        console.log(err);
      });
  };
};

export const onSearch = (term) => {
  return {
    type: "ON_USER_SEARCH",
    payload: term,
  };
};

export const cookieChecker = () => {
  return {
    type: "COOKIE_CHECK",
  };
};
