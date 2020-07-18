import React from "react";
import Axios from "axios";
import "./Payment.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";

class Payment extends React.Component {
  state = {
    paymentList: [],
    category: "",
  };

  componentDidMount = () => {
    this.loadPaymentList();
  };

  loadPaymentList = () => {
    Axios.get(`${API_URL}/transaction?_expand=user`)
      .then((res) => {
        this.setState({
          paymentList: res.data,
        });
      })
      .catch((err) => console.log(err));
  };

  setCategory = (key) => {
    this.setState({
      category: key,
    });
  };

  renderPaymentList = () => {
    return this.state.paymentList.map((val) => {
      const { id, purchaseDate, totalPayment, status, user } = val;
      const statusCur = this.state.category;
      if (statusCur !== "") {
        if (status === statusCur) {
          return (
            <tr>
              <td>{id}</td>
              <td>{user.username}</td>
              <td>{purchaseDate}</td>
              {totalPayment ? (
                <td>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(totalPayment)}
                </td>
              ) : (
                <td>-</td>
              )}
              <td>{status}</td>
              <td>
                <Link to={`/payment/details/${val.id}`}>
                  <ButtonUI type="textual">Details</ButtonUI>
                </Link>
              </td>
            </tr>
          );
        }
      } else {
        return (
          <tr>
            <td>{id}</td>
            <td>{user.username}</td>
            <td>{purchaseDate}</td>
            {totalPayment ? (
              <td>
                {" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(totalPayment)}
              </td>
            ) : (
              <td>-</td>
            )}
            <td>{status}</td>
            <td>
              <Link to={`/payment/details/${val.id}`}>
                <ButtonUI type="textual">Details</ButtonUI>
              </Link>
            </td>
          </tr>
        );
      }
    });
  };

  render() {
    return (
      <div className="container pt-4 pb-4">
        <div className="payment">
          <caption className="p-3 ">
            <h2>Transaction List</h2>
          </caption>
          <div className="d-flex justify-content-center flex-row align-items-center mt-2">
            <Link to="/payment" style={{ color: "inherit" }}>
              <h6
                onClick={() => {
                  this.setCategory("");
                }}
                className="mx-4 font-weight-bold"
              >
                ALL
              </h6>
            </Link>
            <Link to="/payment" style={{ color: "inherit" }}>
              <h6
                onClick={() => {
                  this.setCategory("Confirmed");
                }}
                className="mx-4 font-weight-bold"
              >
                CONFIRMED
              </h6>
            </Link>
            <Link to="/payment" style={{ color: "inherit" }}>
              <h6
                onClick={() => {
                  this.setCategory("Waiting for confirmation");
                }}
                className="mx-4 font-weight-bold"
              >
                PENDING
              </h6>
            </Link>
            <Link to="/payment" style={{ color: "inherit" }}>
              <h6
                onClick={() => {
                  this.setCategory("unpaid");
                }}
                className="mx-4 font-weight-bold"
              >
                UNPAID
              </h6>
            </Link>
          </div>
          <table className="dashboard-table mt-3">
            <thead>
              <th>Transaction Id</th>
              <th>Username</th>
              <th>Purchase Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </thead>
            <tbody>{this.renderPaymentList()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Payment);
