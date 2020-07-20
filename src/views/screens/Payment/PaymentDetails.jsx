import React from "react";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import { API_URL, API_URL_JAVA } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

class PaymentDetails extends React.Component {
  state = {
    transList: [],
    itemList: [],
    status: "",
    modalOpen: false,
  };

  componentDidMount = () => {
    Axios.get(`${API_URL}/transaction/${this.props.match.params.transId}`)
      .then((res) => {
        this.setState({
          transList: res.data,
          itemList: [...res.data.itemList],
          status: res.data.status,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  showSum = () => {
    let sum = 0;
    for (let i = 0; i < this.state.itemList.length; i++) {
      sum += this.state.itemList[i].price * this.state.itemList[i].quantity;
    }
    return sum;
  };

  //Mengambil tanggal hari ini untuk mencatat tanggal konfirmasi pembayaran
  getDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    return (today = dd + "/" + mm + "/" + yyyy);
  };

  confirmBill = () => {
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willConfirm) => {
        if (willConfirm) {
          Axios.patch(
            `${API_URL}/transaction/${this.props.match.params.transId}`,
            {
              confirmationDate: this.getDate(),
              status: "Confirmed",
            }
          )
            .then(() => {
              this.state.itemList.map((val) => {
                let prevTotal = 0;

                Axios.get(`${API_URL}/products`, {
                  params: {
                    id: val.productId,
                  },
                }).then((res) => {
                  prevTotal = parseInt(res.data[0].totalPurchased);
                  Axios.patch(`${API_URL}/products/${res.data[0].id}`, {
                    totalPurchased: prevTotal + val.quantity,
                  })
                    .then(() => {
                      this.setState({
                        status: "Confirmed",
                      });
                      //Mengirim invoice ke email user
                      Axios.post(`${API_URL_JAVA}/users/transaction`, {
                        ...this.state.transList,
                      }).then((res) => {
                        swal(
                          "Confirmed!",
                          "Pembelian telah dikonfirmasi dan invoice telah dikirim ke email pembeli",
                          "success"
                        );
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
              });
            })
            .catch((err) => {
              swal("Oops...", "Something went wrong", "error");
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  cancelBill = () => {
    this.state.itemList.map((val) => {
      var newqty = 0;
      Axios.get(`${API_URL}/products`, {
        params: {
          id: val.productId,
        },
      }).then((res) => {
        newqty = parseInt(res.data[0].quantity) + val.quantity;
        Axios.patch(`${API_URL}/products/${res.data[0].id}`, {
          quantity: newqty,
        })
          .then(() => {
            swal({
              title: "Are you sure?",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                swal("Kirimkan pesan ke pengguna", {
                  content: "input",
                }).then((value) => {
                  if (!value) {
                    value = "Upload ulang gan";
                  }
                  Axios.patch(
                    `${API_URL}/transaction/${this.props.match.params.transId}`,
                    {
                      status: "unpaid",
                      cancelationMessage: value,
                    }
                  )
                    .then((res) => {
                      this.setState({
                        status: "unpaid",
                      });
                      swal("Done!", "Customer will be noticed", "success");
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
              }
            });
          })
          .catch((err) => {
            swal("Oops...", "Something went wrong", "error");
          });
      });
    });
  };

  toogleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  renderTransactionDetails = () => {
    return this.state.itemList.map((val) => {
      return (
        <tr>
          <td>{val.productName}</td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(val.price)}
          </td>
          <td>{val.quantity}</td>
          <td>
            {" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(val.price * val.quantity)}
          </td>
        </tr>
      );
    });
  };

  render() {
    if (
      this.props.user.role === "admin" ||
      this.state.transList.userId === ""
    ) {
      return (
        <div className="container text-center">
          <h2>Payment Details</h2>
          <h3>Transaction id : {this.state.transList.id}</h3>
          <table className="dashboard-table">
            <thead>
              <th>Item(s)</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </thead>
            <tbody>{this.renderTransactionDetails()}</tbody>
            <tfoot>
              <tr>
                <td colSpan="2"></td>
                <th>Total</th>
                <th>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(this.showSum())}
                </th>
              </tr>
            </tfoot>
          </table>
          <div className="d-flex flex-column justify-content-center align-center mt-3">
            <center>
              <ButtonUI type="textual" func={this.toogleModal}>
                <h5>Lihat Bukti Transfer</h5>
              </ButtonUI>
            </center>
          </div>
          {this.state.status === "Waiting for confirmation" ? (
            <div className="d-flex justify-content-center mt-3">
              <ButtonUI
                func={() => {
                  this.confirmBill();
                }}
                className="mr-2"
              >
                {" "}
                Accept
              </ButtonUI>
              <ButtonUI
                func={() => {
                  this.cancelBill();
                }}
                type="outlined"
                className="mr-2"
              >
                {" "}
                Reject
              </ButtonUI>
            </div>
          ) : this.state.status === "Confirmed" ? (
            <h3 className="text-center">Lunas!</h3>
          ) : (
            <h3 className="text-center">Pembeli belum melakukan pembayaran.</h3>
          )}
          <Modal toggle={this.toogleModal} isOpen={this.state.modalOpen}>
            <ModalHeader>
              <h3>Bukti Transfer</h3>
            </ModalHeader>
            <ModalBody>
              <img
                className="img-fluid pr-3"
                style={{ height: "360px", width: "360px" }}
                src={this.state.transList.transactionImage}
                alt="transfer"
              ></img>
            </ModalBody>
          </Modal>
        </div>
      );
    } else {
      return <Redirect to="*" />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(PaymentDetails);
