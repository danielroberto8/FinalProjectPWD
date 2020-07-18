import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { editUserHandler, editPasswordHandler } from "../../../redux/actions";
import "./Profile.css";
import ButtonUI from "../../components/Button/Button";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";

class Profile extends React.Component {
  state = {
    editInfo: {
      id: 0,
      username: "",
      address: "",
      phone: "",
    },
    editPassword: {
      passwordOld: "",
      passwordNew: "",
    },
    userDetails: [],
    modalOpen: false,
    modalType: "info",
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  toggleModal = (type) => {
    if (!this.props.user.verified && type === "password") {
      swal(
        "Oops...",
        "Anda belum verified.\nVerifikasi email anda terlebih dahulu.",
        "error"
      );
    } else {
      this.setState({
        modalOpen: !this.state.modalOpen,
        modalType: type,
        editInfo: {
          username: this.props.user.username,
          address: this.props.user.address,
          phone: this.props.user.phone,
        },
      });
    }
  };

  saveBtnHandler = () => {
    const { username, address, phone } = this.state.editInfo;
    if (username !== "" && address !== "" && phone !== "") {
      var smallUsername = username.toLowerCase();
      this.setState({
        editInfo: {
          username: smallUsername,
        },
      });
      this.props.editUserHandler(this.props.user.id, this.state.editInfo);
      this.toggleModal();
    } else {
      swal("Oops...", "Ada field yang kosong slur", "error");
      this.setState({
        editInfo: {
          username: this.state.userDetails.username,
          address: this.state.userDetails.address,
          phone: this.state.userDetails.phone,
        },
      });
    }
  };

  changePassword = () => {
    const { passwordOld, passwordNew } = this.state.editPassword;
    if (passwordOld !== "" && passwordNew !== "") {
      this.props.editPasswordHandler(
        this.props.user.id,
        this.props.user.username,
        passwordOld,
        passwordNew
      );
      this.toggleModal();
    } else {
      swal("Oops...", "Ada field yang kosong slur", "error");
    }
  };

  render() {
    if (
      this.props.match.params.username === this.props.user.username ||
      this.props.user.username === ""
    ) {
      return (
        <div className="container text-center pt-4">
          <div className="profile p-3">
            <caption className="p-3 text-center">
              <h2 className>Profile</h2>
            </caption>
            <div className="row">
              <div className="col-8 text-left">
                <h4 className="text-left">Personal Infromation</h4>
                <div classname="font-weight-light ">
                  Fullname :{" "}
                  <h6 className="font-weight-bold">
                    {this.props.user.fullname}
                  </h6>
                </div>
                <div classname="font-weight-light ">
                  Username :{" "}
                  <h6 className="font-weight-bold">
                    {this.props.user.username}
                  </h6>
                </div>
                <div classname="font-weight-light ">
                  Email :{" "}
                  <h6 className="font-weight-bold">{this.props.user.email}</h6>
                </div>
                <div classname="font-weight-light ">
                  Phone :{" "}
                  <h6 className="font-weight-bold">{this.props.user.phone}</h6>
                </div>
                <div classname="font-weight-light ">
                  Address :{" "}
                  <h6 className="font-weight-bold">
                    {this.props.user.address}
                  </h6>
                </div>
                <div classname="font-weight-light ">
                  Status :{" "}
                  <h6 className="font-weight-bold">
                    {this.props.user.verified ? (
                      <>Verified</>
                    ) : (
                      <>Not verified</>
                    )}
                  </h6>
                </div>
              </div>
              <div className="col-4 d-flex-row justify-content-center">
                <h4>Actions</h4>
                <center>
                  <ButtonUI
                    className="mt-2"
                    type="outlined"
                    func={(_) => this.toggleModal("info")}
                  >
                    Change Personal Info
                  </ButtonUI>
                  <ButtonUI
                    className="mt-2"
                    type="outlined"
                    func={(_) => this.toggleModal("password")}
                  >
                    Change Password
                  </ButtonUI>
                </center>
              </div>
            </div>
          </div>
          <Modal
            toggle={this.toggleModal}
            isOpen={this.state.modalOpen}
            className="edit-modal"
          >
            <ModalHeader>
              <caption>
                {this.state.modalType === "info" ? (
                  <h3>Change Personal Info</h3>
                ) : (
                  <h3>Change Password</h3>
                )}
              </caption>
            </ModalHeader>
            <ModalBody>
              <div className="container">
                <div className="row">
                  {this.state.modalType === "info" ? (
                    <div className="col-12">
                      <caption>Username</caption>
                      <TextField
                        value={this.state.editInfo.username}
                        onChange={(e) =>
                          this.inputHandler(e, "username", "editInfo")
                        }
                      />
                      <caption>Phone</caption>
                      <TextField
                        value={this.state.editInfo.phone}
                        onChange={(e) =>
                          this.inputHandler(e, "phone", "editInfo")
                        }
                      />
                      <caption>Address</caption>
                      <TextField
                        value={this.state.editInfo.address}
                        onChange={(e) =>
                          this.inputHandler(e, "address", "editInfo")
                        }
                      />
                      <div className="col-12">
                        <div className="d-flex flex-row justify-content-center mt-3">
                          <ButtonUI
                            type="contained mr-2"
                            func={this.saveBtnHandler}
                          >
                            save
                          </ButtonUI>
                          <ButtonUI
                            type="outlined ml-2"
                            func={(_) => this.toggleModal(this.state.modalType)}
                          >
                            cancel
                          </ButtonUI>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-12">
                      <caption>Password Lama</caption>
                      <TextField
                        type="password"
                        onChange={(e) =>
                          this.inputHandler(e, "passwordOld", "editPassword")
                        }
                      />
                      <caption>Password Baru</caption>
                      <TextField
                        type="password"
                        onChange={(e) =>
                          this.inputHandler(e, "passwordNew", "editPassword")
                        }
                      />
                      <div className="col-12">
                        <div className="d-flex flex-row justify-content-center mt-3">
                          <ButtonUI
                            type="contained mr-2"
                            func={this.changePassword}
                          >
                            save
                          </ButtonUI>
                          <ButtonUI
                            type="outlined ml-2"
                            func={(_) => this.toggleModal(this.state.modalType)}
                          >
                            cancel
                          </ButtonUI>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      );
    } else {
      return (
        <>
          <Redirect to={`/profile/${this.props.user.username}`} />
        </>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  editUserHandler: editUserHandler,
  editPasswordHandler: editPasswordHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
