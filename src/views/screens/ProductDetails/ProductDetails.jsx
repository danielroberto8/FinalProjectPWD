import React from "react";
import Axios from "axios";
import { onCartChange } from "../../../redux/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ButtonUI from "../../components/Button/Button";
import { API_URL_JAVA } from "../../../constants/API";
import swal from "sweetalert";

class ProductDetails extends React.Component {
  state = {
    id: 0,
    productName: "",
    price: 0,
    quantity: 0,
    discount: 0,
    image: "",
    description: "",
  };

  componentDidMount() {
    Axios.get(`${API_URL_JAVA}/products/${this.props.match.params.productId}`)
      .then((res) => {
        const {
          id,
          productName,
          price,
          image,
          quantity,
          discount,
          description,
        } = res.data;
        this.setState({
          id,
          productName,
          price,
          quantity,
          discount,
          image,
          description,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addToCartHandler = () => {
    const user_id = this.props.user.id;
    const product_id = this.state.id;
    Axios.get(`${API_URL_JAVA}/carts`, {
      params: {
        user_id,
        product_id,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          const { id, product_id, quantity } = res.data[0];
          let newqty = quantity + 1;
          Axios.patch(`${API_URL_JAVA}/carts/${id}`, {
            quantity: newqty,
          })
            .then((res) => {
              swal("Thank you!", "Produk ditambahkan ke keranjang", "success");
              this.cartChangeHandler(product_id);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          Axios.post(`${API_URL_JAVA}/carts`, {
            user_id: this.props.user.id,
            product_id: product_id,
            quantity: 1,
          })
            .then((res) => {
              console.log(res);
              swal("Thank you!", "Produk ditambahkan ke keranjang", "success");
              this.cartChangeHandler(product_id);
            })
            .catch((err) => {
              swal("error bro");
              console.log(err);
            });
        }
      })
      .catch((err) => {
        swal("Something went wrong");
      });
  };

  cartChangeHandler = (product_id) => {
    Axios.get(`${API_URL_JAVA}/cart`).then((res) => {
      res.data.map((val) => {
        if (val.product_id === product_id) {
          return <></>;
        }
      });
      this.props.onCartChange(res.data.length);
    });
  };

  render() {
    const { productName, price, discount, image, description } = this.state;
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
            <h5 className="mt-3 text-justify text-secondary">{description}</h5>
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
