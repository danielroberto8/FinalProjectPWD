import React from "react";
import Axios from "axios";
import { API_URL, API_URL_JAVA } from "../../../constants/API";
import "./Report.css";
import swal from "sweetalert";

class Report extends React.Component {
  state = {
    userList: [],
    transactionList: [],
    productSold: [],
    switch: true,
  };

  componentDidMount = () => {
    Axios.get(`${API_URL}/transaction`, {
      params: {
        status: "Confirmed",
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

    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({
          productSold: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    this.loadUserList();
  };

  loadUserList = () => {
    Axios.get(`${API_URL_JAVA}/users`)
      .then((res) => {
        this.setState({
          userList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getTotalSpent = (userId) => {
    let total = 0;
    this.state.transactionList.map((val) => {
      if (val.user === userId) {
        total += val.totalPayment;
      }
    });
    return total;
  };

  getQuantity = (userId) => {
    let quantity = 0;
    this.state.transactionList.map((val) => {
      if (val.user === userId) {
        val.itemList.map((val) => {
          quantity += val.quantity;
        });
      }
    });
    return quantity;
  };

  countTrans = (userId) => {
    let count = 0;
    this.state.transactionList.map((val) => {
      if (val.user === userId) {
        count++;
      }
    });
    return count;
  };

  checkUserExist = (arr, userId) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === userId) {
        return true;
      }
    }
    return false;
  };

  renderUserList = () => {
    let arrList = [];
    return this.state.transactionList.map((val) => {
      const { user } = val;
      if (!this.checkUserExist(arrList, user)) {
        arrList.push(user);
        return (
          <tr>
            <td>{user}</td>
            <td>
              {this.state.userList.map((val) => {
                if (val.id === user) {
                  return val.username;
                }
              })}
            </td>
            <td>{this.countTrans(user)}</td>
            <td>{this.getQuantity(user)}</td>
            <td>
              {" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(this.getTotalSpent(user))}
            </td>
          </tr>
        );
      }
    });
  };

  renderProductSold = () => {
    return this.state.productSold.map((val) => {
      const { id, productName, totalPurchased, category } = val;
      if (totalPurchased > 0) {
        return (
          <tr>
            <td>{id}</td>
            <td>{productName}</td>
            <td>{category}</td>
            <td>{totalPurchased}</td>
            <td>{}</td>
          </tr>
        );
      } else {
        return <></>;
      }
    });
  };

  sortArray = (property) => {
    swal(`Berhasil disortir berdasarkan ${property}`);
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    if (this.state.switch) {
      return function (a, b) {
        var result =
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
      };
    } else {
      return function (a, b) {
        var result =
          a[property] > b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
      };
    }
  };

  dynamicSort = (property) => {
    let arrTemp = this.state.productSold;
    arrTemp.sort(this.sortArray(property));
    this.setState({
      productSold: arrTemp,
      switch: !this.state.switch,
    });
    this.renderProductSold();
  };

  render() {
    return (
      <div className="container text-center pt-4 pb-4">
        <div className="report">
          <h2 className="text-secondary">Transaksi yang Berhasil</h2>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>user id</th>
                <th>username</th>
                <th>Total transaction</th>
                <th>Total item(s) bought</th>
                <th>Total money spent</th>
              </tr>
            </thead>
            <tbody>{this.renderUserList()}</tbody>
          </table>
          <h2 className="text-secondary">Barang Terjual</h2>
          <table className="table table-hover">
            <thead>
              <tr>
                <th onClick={(_) => this.dynamicSort("id")}>Product Id</th>
                <th onClick={(_) => this.dynamicSort("productName")}>
                  Product Name
                </th>
                <th onClick={(_) => this.dynamicSort("category")}>Category</th>
                <th onClick={(_) => this.dynamicSort("totalPurchased")}>
                  Total Sold
                </th>
              </tr>
            </thead>
            <tbody>{this.renderProductSold()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Report;
