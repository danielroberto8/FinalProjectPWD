import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import swal from "sweetalert";
import { loginHandler, registerHandler } from "../../../redux/actions";
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import Cookie from "universal-cookie";
import passwordHash from "password-hash";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL, API_URL_JAVA } from "../../../constants/API";

const cookieObject = new Cookie();

class AuthScreen extends React.Component {
  state = {
    usernameLogin: "",
    passwordLogin: "",
    showPasswordLogin: false,
    lastLogin: null,
    usernameRegis: "",
    fullnameRegis: "",
    emailRegis: "",
    addressRegis: "",
    phoneRegis: "",
    passwordRegis: "",
    showPasswordRegis: false,
    modalOpen: false,
    emailForget: "",
  };

  componentDidUpdate() {
    if (this.props.user.username !== "") {
      cookieObject.set("authData", JSON.stringify(this.props.user));
    }
  }

  inputHandler = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  checkBoxHandler = (e, field) => {
    const { checked } = e.target;

    this.setState({
      [field]: checked,
    });
  };

  clearState = () => {
    this.setState({
      usernameLogin: "",
      passwordLogin: "",
      usernameRegis: "",
      fullnameRegis: "",
      passwordRegis: "",
      lastLogin: "",
      emailRegis: "",
      addressRegis: "",
      phoneRegis: "",
      modalOpen: false,
    });
  };

  login = () => {
    const { usernameLogin, passwordLogin } = this.state;

    if (usernameLogin === "") {
      return swal("Oops...", "username tidak boleh kosong", "warning");
    }

    if (passwordLogin === "") {
      return swal("Oops...", "password tidak boleh kosong", "warning");
    }

    const userData = {
      username: usernameLogin,
      password: passwordLogin,
      lastlogin: this.getDate(),
    };

    this.clearState();
    this.props.loginHandler(userData);
  };

  getDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    return (today = dd + "/" + mm + "/" + yyyy);
  };

  register = () => {
    const {
      usernameRegis,
      fullnameRegis,
      passwordRegis,
      emailRegis,
      addressRegis,
      phoneRegis,
    } = this.state;
    if (
      usernameRegis === "" ||
      fullnameRegis === "" ||
      passwordRegis === "" ||
      emailRegis === "" ||
      addressRegis === "" ||
      phoneRegis === ""
    ) {
      return swal(
        "Oops...",
        "Form tidak boleh ada yang kosong hyung",
        "warning"
      );
    }

    const userData = {
      username: usernameRegis,
      fullname: fullnameRegis,
      password: passwordHash.generate(passwordRegis),
      email: emailRegis,
      address: addressRegis,
      phone: phoneRegis,
      lastlogin: this.getDate(),
      verified: false,
      role: "user",
    };

    console.log(userData.password);
    this.clearState();
    this.props.registerHandler(userData);
    Axios.post(`${API_URL_JAVA}/users/sendverifemail/${emailRegis}`)
      .then((res) => {
        swal(
          "Yeay!",
          `Email verifikasi sudah dikirim ke ${emailRegis}`,
          "success"
        );
      })
      .catch((err) => {
        swal("gagal bro");
      });
  };

  toggleShow = (field) => {
    this.setState({ showPasswordLogin: !this.state.showPasswordLogin });
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  submitEmailForget = () => {
    if (this.state.emailForget && this.state.emailForget.indexOf("@") > 0) {
      Axios.get(`${API_URL_JAVA}/users/email/${this.state.emailForget}`)
        .then((res) => {
          if (res.data) {
            Axios.post(
              `${API_URL_JAVA}/users/sendemailreset/${this.state.emailForget}`
            )
              .then((res) => {
                swal(
                  "Yeay!",
                  `Email verifikasi sudah dikirim ke ${this.state.emailForget}`,
                  "success"
                );
              })
              .catch((err) => {
                swal("gagal bro");
              });
          } else {
            swal(
              "Oops...",
              `email ${this.state.emailForget} belum kedaftar bro`,
              "error"
            );
          }
        })
        .catch((err) => {
          swal("gagal broww");
        });
      this.toggleModal();
    } else {
      swal("Oops...", "Emailnya belum diisi hyung", "error");
    }
  };

  render() {
    if (this.props.match.params.type === "login" && !this.props.user.isLogged) {
      return (
        <div className="container">
          <div className="row mt-5 d-flex justify-content-center">
            <div className="col-5">
              <div>
                <h3 className="text-center">Log In</h3>
                <TextField
                  placeholder="Username"
                  className="mt-3"
                  value={this.state.usernameLogin}
                  onChange={(e) => {
                    this.inputHandler(e, "usernameLogin");
                  }}
                />
                <div className="input-group">
                  <TextField
                    placeholder="Password"
                    className="mt-2"
                    value={this.state.passwordLogin}
                    type={this.state.showPasswordLogin ? "text" : "password"}
                    onChange={(e) => {
                      this.inputHandler(e, "passwordLogin");
                    }}
                  />
                  <span className="input-group-btn">
                    <button
                      className="btn btn-default reveal"
                      type="button"
                      onClick={(_) => this.toggleShow("showPasswordLogin")}
                    >
                      <i class="glyphicon glyphicon-eye-open"></i>
                    </button>
                  </span>
                </div>
                <ButtonUI type="textual" func={this.toggleModal}>
                  Lupa password?
                </ButtonUI>
                <div className="d-flex justify-content-center">
                  <ButtonUI type="contained" className="mt-4" func={this.login}>
                    Login
                  </ButtonUI>
                </div>
              </div>
            </div>
          </div>
          <Modal toggle={this.toggleModal} isOpen={this.state.modalOpen}>
            <ModalHeader>
              <h5 className="text-center text-secondary">
                Masukkan alamat email
              </h5>
            </ModalHeader>
            <ModalBody>
              <div>
                <TextField
                  placeholder="email"
                  className="mt-3"
                  value={this.state.emailForget}
                  onChange={(e) => {
                    this.inputHandler(e, "emailForget");
                  }}
                />
                <ButtonUI
                  type="contained"
                  className="mt-4"
                  func={this.submitEmailForget}
                >
                  Submit
                </ButtonUI>
              </div>
            </ModalBody>
          </Modal>
        </div>
      );
    } else if (
      this.props.match.params.type === "register" &&
      !this.props.user.isLogged
    ) {
      return (
        <div className="container pb-4">
          <div className="row mt-5 d-flex justify-content-center">
            <div className="col-5">
              <div>
                <h3 className="text-center">Register</h3>
                <TextField
                  placeholder="Full name"
                  className="mt-3"
                  value={this.state.fullnameRegis}
                  onChange={(e) => {
                    this.inputHandler(e, "fullnameRegis");
                  }}
                />
                <TextField
                  placeholder="Username"
                  className="mt-2"
                  value={this.state.usernameRegis}
                  onChange={(e) => {
                    this.inputHandler(e, "usernameRegis");
                  }}
                />
                <TextField
                  placeholder="Email"
                  className="mt-2"
                  type="email"
                  value={this.state.emailRegis}
                  onChange={(e) => {
                    this.inputHandler(e, "emailRegis");
                  }}
                />
                <div className="input-group">
                  <TextField
                    placeholder="Password"
                    className="mt-2"
                    value={this.state.passwordRegis}
                    type={this.state.showPasswordRegis ? "text" : "password"}
                    onChange={(e) => {
                      this.inputHandler(e, "passwordRegis");
                    }}
                  />
                  {/* <span className="input-group-btn">
                    <button
                      className="btn btn-default reveal"
                      type="button"
                      onClick={(_) => this.toggleShow("showPasswordRegis")}
                    >
                      <i class="glyphicon glyphicon-eye-open"></i>
                    </button>
                  </span> */}
                </div>
                <TextField
                  placeholder="Address"
                  className="mt-2"
                  value={this.state.addressRegis}
                  onChange={(e) => {
                    this.inputHandler(e, "addressRegis");
                  }}
                />
                <TextField
                  placeholder="Phone"
                  className="mt-2"
                  value={this.state.phoneRegis}
                  onChange={(e) => {
                    this.inputHandler(e, "phoneRegis");
                  }}
                />
                <div className="d-flex justify-content-center">
                  <ButtonUI
                    type="contained"
                    className="mt-4"
                    func={this.register}
                  >
                    Register
                  </ButtonUI>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  loginHandler: loginHandler,
  registerHandler: registerHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
