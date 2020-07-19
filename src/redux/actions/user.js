import Axios from "axios";
import { API_URL_JAVA } from "../../constants/API";
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
    const { username, password, lastlogin } = userData;

    Axios.get(`${API_URL_JAVA}/users/username/${username}`)
      .then((res) => {
        if (res.data) {
          if (passwordHash.verify(password, res.data.password)) {
            swal("Yeay!", "Login berhasil", "success");
            dispatch({
              type: ON_LOGIN_SUCCESS,
              payload: res.data,
            });
            console.log(res.data);
            Axios.patch(`${API_URL_JAVA}/users/${res.data.id}`, {
              lastlogin,
            })
              .then((res) => {
                swal("Yeay!", "Login berhasil", "success");
              })
              .catch((err) => {
                swal("fail");
              });
          } else {
            swal("Oops...", "Password yang kamu masukkan salah", "error");
          }
        } else {
          swal("Oops...", "Username yang kamu masukkan salah", "error");
        }
      })
      .catch((err) => {});
  };
};

export const userKeepLogin = (userData) => {
  return (dispatch) => {
    Axios.get(`${API_URL_JAVA}/users/username/${userData.username}`)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data,
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
  const { username, email } = userData;
  return (dispatch) => {
    Axios.get(`${API_URL_JAVA}/users/username/${username}`)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: "ON_REGISTER_FAIL",
            payload: `Username ${username} sudah digunakan`,
          });
        } else {
          Axios.get(`${API_URL_JAVA}/users/email/${email}`)
            .then((res) => {
              if (res.data) {
                dispatch({
                  type: "ON_REGISTER_FAIL",
                  payload: `Email ${email} sudah digunakan`,
                });
              } else {
                Axios.post(`${API_URL_JAVA}/users`, userData)
                  .then((res) => {
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
            .catch((err) => {});
        }
      })
      .catch((err) => {});
  };
};

export const editUserHandler = (id, curentuser, curentemail, userData) => {
  return (dispatch) => {
    const { fullname, username, email, address, phone, verified } = userData;
    Axios.get(`${API_URL_JAVA}/users/username/${username}`)
      .then((res) => {
        if (!res.data || username === curentuser) {
          Axios.get(`${API_URL_JAVA}/users/email/${email}`).then((res) => {
            if (!res.data || email === curentemail) {
              Axios.patch(`${API_URL_JAVA}/users/${id}`, {
                fullname,
                username,
                email,
                address,
                phone,
                verified,
              })
                .then((res) => {
                  swal("Yeay!", "Update data berhasil", "success");
                  Axios.get(`${API_URL_JAVA}/users/username/${username}`)
                    .then((res) => {
                      dispatch({
                        type: ON_LOGIN_SUCCESS,
                        payload: res.data,
                      });
                    })
                    .catch((err) => {
                      swal("addafafafba");
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              swal("Oops...", `Email ${email} sudah ada yang pakai`, "error");
            }
          });
        } else {
          swal("Oops...", `Username ${username} sudah dipakai`, "error");
        }
      })
      .catch((err) => {
        swal("eror lagi bro");
        console.log(err);
      });
  };
};

export const editPasswordHandler = (id, username, passwordOld, passwordNew) => {
  return (dispatch) => {
    Axios.get(`${API_URL_JAVA}/users/username/${username}`)
      .then((res) => {
        if (passwordHash.verify(passwordOld, res.data.password)) {
          Axios.patch(`${API_URL_JAVA}/users/${id}`, {
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
