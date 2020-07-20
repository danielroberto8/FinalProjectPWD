import React from "react";
import Axios from "axios";
import { onCartChange } from "../../../redux/actions";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import ButtonUI from "../../components/Button/Button";
import { API_URL } from "../../../constants/API";
import swal from "sweetalert";

class ProductDetails extends React.Component {
  state = {
    id: 0,
    productName: "",
    price: 0,
    quantity: 0,
    discount: 0,
    image: "",
    desc: "",
  };

  componentDidMount() {
    Axios.get(`${API_URL}/products`, {
      params: {
        id: this.props.match.params.productId,
      },
    })
      .then((res) => {
        const {
          id,
          productName,
          price,
          image,
          quantity,
          discount,
          desc,
        } = res.data[0];
        this.setState({
          id,
          productName,
          price,
          quantity,
          discount,
          image,
          desc,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addToCartHandler = () => {
    const user = this.props.user.id;
    const productId = this.state.id;
    Axios.get(`${API_URL}/cart`, {
      params: {
        user,
        productId,
      },
    }).then((res) => {
      if (res.data.length > 0) {
        const { id, user, productId, quantity } = res.data[0];
        Axios.put(`${API_URL}/cart/${id}`, {
          id,
          user,
          productId,
          quantity: quantity + 1,
        })
          .then((res) => {
            swal("Thank you!", "Produk ditambahkan ke keranjang", "success");
            this.cartChangeHandler(productId);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        Axios.post(`${API_URL}/cart`, {
          user: this.props.user.id,
          productId: this.state.id,
          quantity: 1,
        })
          .then((res) => {
            console.log(res);
            swal("Thank you!", "Produk ditambahkan ke keranjang", "success");
            this.cartChangeHandler(productId);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  cartChangeHandler = (productId) => {
    Axios.get(`${API_URL}/cart`).then((res) => {
      res.data.map((val) => {
        if (val.productId === productId) {
          return <></>;
        }
      });
      this.props.onCartChange(res.data.length);
    });
  };

  render() {
    const { productName, price, discount, image, desc } = this.state;
    const { isLogged } = this.props.user;
    return (
      <div className="container pt-4 pb-4">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12 p-3 d-flex justify-content-center">
            <img className="img-fluid" src={image} alt="" />
          </div>
          <div className="col-lg-6 col-md-6 col-12 d-flex flex-column justify-content-center">
            <h3>{productName}</h3>
            <h4>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(price - price * (discount / 100))}
            </h4>
            <h5 className="mt-3 text-justify text-secondary">{desc}</h5>
            {isLogged ? (
              <div className="d-flex mt-4">
                <ButtonUI func={this.addToCartHandler}>Add to cart</ButtonUI>
              </div>
            ) : (
              <div className="d-flex mt-4">
                <Link to="/Auth/login">
                  <ButtonUI>Add to cart</ButtonUI>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    cart: state.cart,
  };
};

export default connect(mapStateToProps, { onCartChange })(ProductDetails);
