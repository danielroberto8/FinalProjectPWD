import React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import "./History.css";

class History extends React.Component {
  state = {
    transactionList: [],
    unfinished: [],
    finished: [],
    category: "",
  };

  componentDidMount() {
    Axios.get(`${API_URL}/transaction`, {
      params: {
        userId: this.props.user.id,
      },
    })
      .then((res) => {
        this.setState({
          transactionList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setCategory = (type) => {
    this.setState({
      category: type,
    });
  };

  renderTransactionList = () => {
    return this.state.transactionList.map((val) => {
      const { id, purchaseDate, confirmationDate, status } = val;
      return (
        <tr className="text-center">
          <td>{id}</td>
          <td>{purchaseDate}</td>
          <td>{confirmationDate !== "" ? confirmationDate : "-"}</td>
          <td>{status}</td>
          <td>
            <Link to={`/transaction/detail/${id}`}>
              <ButtonUI type="textual">details</ButtonUI>
            </Link>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="container text-center pt-4">
        <div className="transaction">
          <h2 className="text-secondary">Transaction</h2>
          <table className="table table-hover">
            <thead>
              <th>Transaction Id</th>
              <th>Purchase date</th>
              <th>Confirmation date</th>
              <th>Status</th>
              <th>Action</th>
            </thead>
            <tbody>{this.renderTransactionList()}</tbody>
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

export default connect(mapStateToProps)(History);
