import React from "react";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import "./Member.css";
import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";

class Member extends React.Component {
  state = {
    userList: [],
  };

  componentDidMount = () => {
    Axios.get(`${API_URL}/users/`)
      .then((res) => {
        this.setState({
          userList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteUser = (idx, username) => {
    swal({
      title: `Apa kah anda yakin ingin menghapus ${username} ?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        Axios.delete(`${API_URL}/users/${idx}`)
          .then((res) => {
            swal("Poof! User berhasil dihapus!", {
              icon: "success",
            });
            Axios.get(`${API_URL}/users/`)
              .then((res) => {
                this.setState({
                  userList: res.data,
                });
                this.renderUserList();
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
            swal("Something went wrong...", {
              icon: "error",
            });
          });
      }
    });
  };

  renderUserList = () => {
    return this.state.userList.map((val) => {
      const {
        id,
        username,
        email,
        address,
        phone,
        role,
        lastLogin,
        verified,
      } = val;
      return (
        <tr>
          <td>{id}</td>
          <td>{username}</td>
          <td>{email}</td>
          <td>{address}</td>
          <td>{phone}</td>
          <td>{role}</td>
          <td>{lastLogin}</td>
          <td>{verified ? <>verified</> : <>-</>}</td>
          <td>
            {role !== "admin" ? (
              <ButtonUI
                type="contained"
                func={(_) => this.deleteUser(id, username)}
              >
                Delete
              </ButtonUI>
            ) : (
              <></>
            )}
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="container text-center pt-4 pb-4">
        <div className="member">
          <caption className="p-3 text-center">
            <h2>Members</h2>
          </caption>
          <table className="table">
            <thead>
              <th>Id</th>
              <th>Username</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Action</th>
            </thead>
            <tbody>{this.renderUserList()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Member;
