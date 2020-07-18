import React from "react";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";
import { storage } from "../../../firebase";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

class HistoryDetails extends React.Component {
  state = {
    productList: [],
    itemList: [],
    delivery: "",
    status: "",
    cancelMessage: "",
    modalOpen: false,
    image: null,
    url: "",
  };

  componentDidMount = () => {
    Axios.get(`${API_URL}/transaction`, {
      params: {
        id: this.props.match.params.transactionId,
      },
    })
      .then((res) => {
        this.setState({
          status: res.data[0].status,
          delivery: res.data[0].delivery,
          itemList: res.data[0].itemList,
          url: res.data[0].transactionImage,
          cancelMessage: res.data[0].cancelationMessage,
        });
        this.state.itemList.map((val) => {
          this.getProductDetails(val.productId);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleChange = (e) => {
    if (e.target.files[0]) {
      let file = e.target.files[0];
      let timeStamp = new Date().getTime();
      let fileExt = file.name.split(".")[file.name.split(".").length - 1];
      let newFileName = "trasnsaction_" + timeStamp + "." + fileExt;
      var new_file = new File([file], newFileName);
      console.log(new_file);
      this.setState({
        image: new_file,
      });
    }
  };

  handleUpload = () => {
    if (this.state.image) {
      const { image } = this.state;
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress
        },
        (error) => {
          alert(error);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              this.setState({
                url,
              });
              this.payHandler(this.props.match.params.transactionId);
              this.toggleModal();
            });
        }
      );
    } else {
      swal("Oops...", "Fotonya upload dulu sayang", "error");
    }
  };

  showSum = () => {
    let sum = 0;
    for (let i = 0; i < this.state.itemList.length; i++) {
      sum += this.state.itemList[i].price * this.state.itemList[i].quantity;
    }
    return sum;
  };

  totalPayment = () => {
    let sum = this.showSum();
    let deliveryPrice = 0;
    switch (this.state.delivery) {
      case "Instant":
        deliveryPrice = 100000;
        break;
      case "Same day":
        deliveryPrice = 50000;
        break;
      case "Express":
        deliveryPrice = 20000;
        break;
      case "Economy":
        deliveryPrice = 0;
        break;
      default:
        break;
    }
    return sum + deliveryPrice;
  };

  getDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    return (today = dd + "/" + mm + "/" + yyyy);
  };

  payHandler = (id) => {
    this.state.itemList.map((val) => {
      var newqty = 0;
      for (let i = 0; i < this.state.productList.length; i++) {
        if (val.productId === this.state.productList[i].id) {
          newqty = this.state.productList[i].quantity - val.quantity;
          if (this.state.productList[i].quantity < val.quantity) {
            swal(
              "Oops...",
              "The item you trying to buy is out of stock",
              "error"
            );
          } else {
            Axios.patch(`${API_URL}/products/${val.productId}`, {
              quantity: newqty,
            })
              .then((res) => {
                Axios.patch(`${API_URL}/transaction/${id}`, {
                  transactionImage: this.state.url,
                  totalPayment: this.totalPayment(),
                  status: "Waiting for confirmation",
                  cancelationMessage: "",
                  purchaseDate: this.getDate(),
                })
                  .then((res) => {
                    swal(
                      "Thank you for your purchase!",
                      "waiting for admin to confirm your payment",
                      "success"
                    );
                    this.setState({
                      status: "paid",
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                swal("Oops...", "Something went wrong", "error");
              });
            break;
          }
        } else {
          swal("Oops...", "Something went wrong", "error");
        }
      }
    });
  };

  getProductDetails = (id) => {
    Axios.get(`${API_URL}/products`, {
      params: {
        id: id,
      },
    })
      .then((res) => {
        let productList = [...this.state.productList];
        productList.push(res.data[0]);
        this.setState({
          productList,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  renderTransactionDetails = () => {
    if (this.state.cancelMessage) {
      swal("Transaksimu dibatalkan", this.state.cancelMessage, "info");
      this.setState({
        cancelMessage: "",
      });
    }
    return this.state.itemList.map((val) => {
      const { productId, productName, price, quantity } = val;
      let image = "";
      let desc = "";
      this.state.productList.map((val) => {
        if (val.id === productId) {
          image = val.image;
          desc = val.desc;
        }
        return <></>;
      });
      return (
        <tr>
          <td>
            <img
              style={{ height: "120px", width: "auto" }}
              alt="Transfer"
              src={image}
            />
          </td>
          <td>{productName}</td>
          <td>
            <p className="text-justify">{desc}</p>
          </td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(price)}
          </td>
          <td>{quantity}</td>
        </tr>
      );
    });
  };

  renderDeliveryDetails = () => {
    let temp = [];
    switch (this.state.delivery) {
      case "Instant":
        temp = { name: "Instant", duration: "3-6 jam", price: 100000 };
        break;
      case "Same day":
        temp = { name: "Same day", duration: "1 hari", price: 50000 };
        break;
      case "Express":
        temp = { name: "Express", duration: "2-3 hari", price: 20000 };
        break;
      case "Economy":
        temp = { name: "Economy", duration: "3-5 hari", price: 0 };
        break;
      default:
        break;
    }
    const { name, duration, price } = temp;
    return (
      <tr>
        <td colSpan="2"></td>
        <td>{name}</td>
        <td>{duration}</td>
        <td>
          {" "}
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(price)}
        </td>
      </tr>
    );
  };

  render() {
    return (
      <div className="container text-center pt-4">
        <h1>Transaction {this.props.match.params.transactionId}</h1>
        <table className="table table-hover">
          <thead>
            <th>image</th>
            <th>Product Name</th>
            <th>desc</th>
            <th>Price</th>
            <th>Quantity</th>
          </thead>
          <tbody>
            {this.renderTransactionDetails()}
            <td colSpan="3"></td>
            <td>Sub-total</td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(this.showSum())}
            </td>
          </tbody>
          <thead>
            <th colSpan="2"></th>
            <th>Delivery</th>
            <th>Duration</th>
            <th>Price</th>
          </thead>
          <tbody>{this.renderDeliveryDetails()}</tbody>
          <tfoot>
            <tr>
              <th colSpan="3"></th>
              <th>Total Payment</th>
              <th>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(this.totalPayment())}
              </th>
            </tr>
            <tr>
              <td colSpan="2"></td>
              <td>
                <h5>Bukti Trasfer</h5>
              </td>
            </tr>
            <tr>
              <td colSpan="2"></td>
              <td>
                <img
                  className="img-fluid"
                  style={{ height: "120px", width: "auto" }}
                  alt="Product"
                  src={this.state.url || "https://via.placeholder.com/150"}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2"></td>
              <td>
                {this.state.status === "unpaid" || this.state.status === "" ? (
                  <ButtonUI func={this.toggleModal}>pay</ButtonUI>
                ) : (
                  <h5>Paid</h5>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
        <Modal toggle={this.toggleModal} isOpen={this.state.modalOpen}>
          <ModalHeader>
            <caption>Upload Bukti Transfer</caption>
          </ModalHeader>
          <ModalBody>
            <div className="d-flex flex-row justify-content-center mt-3">
              <input
                style={{ display: "none" }}
                type="file"
                onChange={(e) => this.handleChange(e)}
                ref={(fileInput) => (this.fileInput = fileInput)}
              />
              <ButtonUI type="textual mr-2" func={() => this.fileInput.click()}>
                Upload
              </ButtonUI>
            </div>
            <div className="d-flex flex-row justify-content-center mt-3">
              <ButtonUI type="contained mr-2" func={() => this.handleUpload()}>
                Submit
              </ButtonUI>
              <ButtonUI
                type="outlined ml-2"
                func={(_) => this.toggleModal(this.state.modalType)}
              >
                cancel
              </ButtonUI>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default HistoryDetails;
