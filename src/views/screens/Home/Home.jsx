import React from "react";
import Axios from "axios";
import { onCartChange } from "../../../redux/actions";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import ProductCard from "../../components/Cards/ProductCard";
import Colors from "../../../constants/Colors";
import { API_URL } from "../../../constants/API";
import Logo from "../../../assets/images/Logo.png";

class Home extends React.Component {
  state = {
    activeIndex: 0,
    animating: false,
    bestSellerData: [],
    category: "",
  };

  componentDidMount = () => {
    this.getBestSellerData();
    Axios.get(`${API_URL}/cart`, {
      params: {
        userId: this.props.user.id,
      },
    })
      .then((res) => {
        this.props.onCartChange(res.data.length);
        console.log(this.props.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getBestSellerData = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({
          bestSellerData: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderProducts = () => {
    return this.state.bestSellerData.map((val) => {
      const category = this.state.category;
      if (
        val.productName.toLowerCase().includes(this.props.search.searchTerm)
      ) {
        if (category !== "") {
          if (val.category === category) {
            return (
              <ProductCard
                key={`bestseller-${val.id}`}
                data={val}
                className="m-2"
              />
            );
          }
        } else {
          return <ProductCard data={val} className="m-2" />;
        }
      }
    });
  };

  renderSpecialPrice = () => {
    return this.state.bestSellerData.map((val) => {
      if (val.discount) {
        return (
          <ProductCard
            key={`bestseller-${val.id}`}
            data={val}
            className="m-2"
          />
        );
      }
    });
  };

  setCategory = (key) => {
    this.setState({
      category: key,
    });
  };

  render() {
    return (
      <div>
        <div className="d-flex justify-content-center flex-row align-items-center mt-3">
          <Link to="/" style={{ color: "inherit" }}>
            <h6
              onClick={() => {
                this.setCategory("");
              }}
              className="mx-4 font-weight-bold"
            >
              ALL
            </h6>
          </Link>
          <Link to="/" style={{ color: "inherit" }}>
            <h6
              onClick={() => {
                this.setCategory("Mountain Bike");
              }}
              className="mx-4 font-weight-bold"
            >
              Mountain Bike
            </h6>
          </Link>
          <Link to="/" style={{ color: "inherit" }}>
            <h6
              onClick={() => {
                this.setCategory("Road Bike");
              }}
              className="mx-4 font-weight-bold"
            >
              Road Bike
            </h6>
          </Link>
          <Link to="/" style={{ color: "inherit" }}>
            <h6
              onClick={() => {
                this.setCategory("Folded Bike");
              }}
              className="mx-4 font-weight-bold"
            >
              Folded Bike
            </h6>
          </Link>
          <Link to="/" style={{ color: "inherit" }}>
            <h6
              onClick={() => {
                this.setCategory("Fixie");
              }}
              className="mx-4 font-weight-bold"
            >
              Fixie
            </h6>
          </Link>
        </div>

        <div className="container">
          <div className="row d-flex flex-wrap justify-content-center">
            {this.renderProducts()}
          </div>
          <h2 className="text-center pt-4">Special Price</h2>
          <div className="row d-flex flex-wrap justify-content-center">
            {this.renderSpecialPrice()}
          </div>
        </div>
        {/* ABOUT SECTION */}
        <div
          className="py-5"
          style={{ marginTop: "128px", backgroundColor: Colors.lightestGray }}
        >
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-lg-4 text-center d-flex flex-column align-items-center">
                <img src={Logo} alt="Logo" style={{ height: 50, width: 150 }} />
                <p className="mt-2 text-justify">
                  Bikelah adalah situs untuk membeli sepeda idamanmu dengan
                  harga rumah dan tanpa ribet.
                </p>
              </div>
              <div className="col-sm-12 col-lg-4 text-center d-flex flex-column align-items-center">
                <h3 className="font-weight-bolder mt-2">Contact Us</h3>
                <p className="mt-2 text-justify">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
                  impedit facilis nam vitae, accusamus doloribus alias
                  repellendus veniam voluptates ad doloremque sequi est, at
                  fugit pariatur quisquam ratione, earum sapiente.
                </p>
              </div>
              <div className="col-sm-12 col-lg-4 text-center d-flex flex-column align-items-center">
                <h3 className="font-weight-bolder mt-2">Disclaimer</h3>
                <p className="mt-2 text-justify">
                  Situs ini bersifat fiksional dan segala gambar yang tercantum
                  tidak digunakan untuk kepentingan komersil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    search: state.search,
  };
};

export default connect(mapStateToProps, { onCartChange })(Home);
