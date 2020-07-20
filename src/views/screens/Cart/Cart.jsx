import React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { API_URL } from "../../../constants/API";
import { onCartChange, onCartDelete } from "../../../redux/actions";
import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";

class Cart extends React.Component {
  state = {
    cartList: [],
    productList: [],
    delivery: "Instant",
  };

  inputHandler = (e) => {
    this.setState({
      delivery: e.target.value,
    });
  };

  componentDidMount = () => {
    this.loadData();
  };

  loadData = () => {
    Axios.get(`${API_URL}/cart`, {
      params: {
        user: this.props.user.id,
      },
    })
      .then((res) => {
        res.data.map((val) => this.fillCart(val));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fillCart = (val) => {
    this.setState({
      cartList: [...this.state.cartList, val],
    });
    Axios.get(`${API_URL}/products`, {
      params: {
        id: val.productId,
      },
    })
      .then((res) => {
        this.setState({
          productList: [...this.state.productList, res.data[0]],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Menambah quantity suatu produk di dalam cart
  addCart = (cartId) => {
    let cartTemp = [];
    for (let i = 0; i < this.state.cartList.length; i++) {
      if (this.state.cartList[i].id === cartId) {
        cartTemp = this.state.cartList[i];
        break;
      }
    }
    const { id, user, productId, quantity } = cartTemp;
    Axios.put(`${API_URL}/cart/${cartId}`, {
      id,
      user,
      productId,
      quantity: quantity + 1,
    })
      .then((res) => {
        this.setState({
          cartList: [],
          productList: [],
        });
        this.loadData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Mengurangi quantity produk di dalam cart
  reduceCart = (cartId) => {
    let cartTemp = [];
    for (let i = 0; i < this.state.cartList.length; i++) {
      if (this.state.cartList[i].id === cartId) {
        cartTemp = this.state.cartList[i];
        break;
      }
    }
    const { id, user, productId, quantity } = cartTemp;
    Axios.put(`${API_URL}/cart/${cartId}`, {
      id,
      user,
      productId,
      quantity: quantity - 1,
    })
      .then((res) => {
        if (quantity < 2) {
          this.deleteCart(cartId);
        } else {
          this.setState({
            cartList: [],
            productList: [],
          });

          this.loadData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Mengahpus sebuah cart
  deleteCart = (cartId) => {
    swal({
      title: "Apa anda yakin ingin menghapus keranjang?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        Axios.delete(`${API_URL}/cart/${cartId}`)
          .then((res) => {
            swal("keranjang berhasil dihapus", {
              icon: "success",
            });
            this.props.onCartDelete();
            this.setState({
              productList: [],
            });
            this.loadData();
          })
          .catch((err) => {
            console.log(err);
            swal("Something went wrong...", {
              icon: "error",
            });
          });
      } else {
        swal("Keranjangmu aman!");
      }
    });
  };

  //Hapus cart secara menyeluruh
  deleteCartList = (key) => {
    this.props.onCartDelete();
    Axios.delete(`${API_URL}/cart/${key}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Menga,bil tanggal hari ini untuk mencatat tanggal pembelian
  getDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();

    return (today = dd + "/" + mm + "/" + yyyy);
  };

  checkOutHandler = () => {
    swal({
      title: "Sudah selesai belanja?",
      text: `Total belanja adalah Rp. sekian dengan pengiriman ${this.state.delivery}`,
      icon: "warning",
      buttons: true,
    }).then((willCheckOut) => {
      const arrCart = this.state.productList.map((val, index) => {
        const { quantity } = this.state.cartList[index];
        return {
          productId: val.id,
          productName: val.productName,
          quantity,
          price: val.price,
        };
      });
      if (willCheckOut) {
        alert(`${API_URL}/transaction`);
        Axios.post(`${API_URL}/transaction`, {
          user: this.props.user.id,
          status: "unpaid",
          purchaseDate: this.getDate(),
          confirmationDate: "",
          totalPayment: 0,
          transactionImage: "",
          cancelationMessage: "",
          delivery: this.state.delivery,
          itemList: [...arrCart],
        })
          .then((res) => {
            this.state.cartList.map((val) => {
              if (val.user === this.props.user.id) {
                this.deleteCartList(val.id);
              }
            });
            this.setState({
              delivery: "",
              cartList: [],
              productList: [],
            });
            swal(
              "Check out berhasil!",
              "Silahkan buka tab transfer anda untuk memeriksa status transaksi",
              "success"
            );
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        swal("Belanja lagi boskuu");
      }
    });
  };

  renderCart = () => {
    return this.state.productList.map((val, index) => {
      let cartTemp = [];
      for (let i = 0; i < this.state.cartList.length; i++) {
        if (
          this.state.cartList[i].user === this.props.user.id &&
          this.state.cartList[i].productId === val.id
        ) {
          cartTemp = this.state.cartList[i];
          break;
        }
      }
      const { id, quantity } = cartTemp;

      return (
        <div className="row mt-5">
          <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center">
            <img
              className="img-fluid"
              style={{ height: "250px" }}
              src={val.image}
              alt=""
            />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex flex-column justify-content-center">
            <h1>{val.productName}</h1>
            <div className="mt-3 d-flex flex-row">
              <h2>Quantity {quantity}</h2>
              <ButtonUI
                className="ml-3"
                type="circular"
                func={() => {
                  this.addCart(id);
                }}
              >
                +
              </ButtonUI>
              <ButtonUI
                className="ml-2"
                type="circular"
                func={() => {
                  this.reduceCart(id);
                }}
              >
                -
              </ButtonUI>
            </div>
            <h2>Total price :</h2>
            <h2>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(val.price * ((100 - val.discount) / 100) * quantity)}
            </h2>{" "}
            <ButtonUI
              className="ml-3"
              type="danger"
              func={() => {
                this.deleteCart(id);
              }}
            >
              Delete
            </ButtonUI>
          </div>
        </div>
      );
    });
  };

  render() {
    if (this.props.user.isLogged) {
      return (
        <div className="container pt-4 pb-4">
          <h3 className="text-center mt-3">Cart</h3>
          {this.state.productList.length > 0 || this.state.init ? (
            <>
              {this.renderCart()}
              <div className="row mt-5">
                <div className="col-lg-6 col-md-6 col-12">
                  <h4 className="text-right">Delivery options : </h4>
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                  <select
                    value={this.state.delivery}
                    className="custom-text-input h-100 pl-3 form-control"
                    style={{ width: "300px" }}
                    onChange={(e) => this.inputHandler(e)}
                  >
                    <option value="Instant">
                      Instant (3-6 jam) Rp.100.000.00
                    </option>
                    <option value="Same day">
                      Same day (1 hari) Rp.50.000.00
                    </option>
                    <option value="Express">
                      Express (2-3 hari) Rp.20.000.00
                    </option>
                    <option value="Economy">
                      Economy (Tungguin aja) Gratis
                    </option>
                  </select>
                </div>
              </div>
              <center>
                <ButtonUI
                  className="mt-5"
                  type="contained"
                  func={this.checkOutHandler}
                >
                  Check Out
                </ButtonUI>
              </center>
            </>
          ) : (
            <div className="text-center d-flex justify-content-center">
              <h3>Keranjang kamu masih kosong nih,</h3>
              <ButtonUI type="textual">
                <h3 className="text-center"> belanja dulu yuk!</h3>
              </ButtonUI>
            </div>
          )}
        </div>
      );
    } else {
      return <Redirect to="/auth/login" />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { onCartChange, onCartDelete })(Cart);
