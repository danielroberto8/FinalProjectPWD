import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";

interface ProductCardData {
  id?: number;
  productName?: string;
  price?: number;
  review?: number;
  image?: string;
  discount?: number;
}

type ProductCardProps = {
  data?: ProductCardData;
  className?: string;
};

class ProductCard extends React.Component<ProductCardProps> {
  render() {
    const { id, productName, price, image, discount } = this.props.data;

    return (
      <Link to={`/product/${id}`}>
        <div
          className={`text product-card d-inline-block ${this.props.className}`}
        >
          <img
            src={image}
            alt={this.props.data.productName}
            style={{ width: "224px", height: "250px", objectFit: "contain" }}
          />
          <div>
            <p className="mt-3 text-center">{productName}</p>

            {discount > 0 ? (
              <>
                <h5
                  className="text-center"
                  style={{ fontWeight: "bolder", color: "grey" }}
                >
                  <s>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(price)}
                  </s>
                </h5>
                <h6 className="text-center">Discount {discount} %</h6>
                <h5 className="text-center" style={{ fontWeight: "bolder" }}>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(price - price * (discount / 100))}
                </h5>
              </>
            ) : (
              <h5 className="text-center" style={{ fontWeight: "bolder" }}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(price)}
              </h5>
            )}
          </div>
        </div>
      </Link>
    );
  }
}

export default ProductCard;
