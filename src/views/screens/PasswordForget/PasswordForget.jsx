import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";
import Axios from "axios";
import { API_URL_JAVA } from "../../../constants/API";
import passwordHash from "password-hash";

class PasswordForget extends React.Component {
  state = {
    passwordReset: "",
    modalOpen: true,
    isFinished: false,
  };

  inputHandler = (e) => {
    let { value } = e.target;
    this.setState({
      passwordReset: value,
    });
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  submitBtnHandler = () => {
    swal({
      title: "Apa anda sudah yakin dengan password baru anda?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willcontinue) => {
        if (willcontinue) {
          alert(passwordHash.generate(this.state.passwordReset));
          alert(
            `${API_URL_JAVA}/users/key/${this.props.match.params.key1}/${this.props.match.params.key2}`
          );
          Axios.patch(
            `${API_URL_JAVA}/users/key/${this.props.match.params.key1}/${this.props.match.params.key2}`,
            {
              password: passwordHash.generate(this.state.passwordReset),
            }
          )
            .then((res) => {
              swal("Yeay!", "Password berhasil dirubah", "success");
              this.toggleModal();
            })
            .catch((err) => {
              swal("error bro");
            });
        } else {
          swal("eror lagi bro");
        }
      })
      .catch((err) => {
        swal("eror");
      });
  };

  render() {
    return (
      <div className="container pt-4 pb-4">
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader>
            <h2 className="text-secondary">Masukkan password baru</h2>
          </ModalHeader>
          <ModalBody>
            <TextField
              type="password"
              value={this.state.passwordReset}
              onChange={(e) => this.inputHandler(e)}
            ></TextField>
            <ButtonUI
              className="mt-3"
              type="contained"
              func={this.submitBtnHandler}
            >
              Submit
            </ButtonUI>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default PasswordForget;
