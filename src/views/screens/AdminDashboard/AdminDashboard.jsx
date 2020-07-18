import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class AdminDashboard extends React.Component {
  state = {
    productList: [],
    createForm: {
      productName: "",
      price: null,
      quantity: null,
      discount: null,
      category: "Mountain Bike",
      image: "",
      desc: "",
      totalPurchased: 0,
    },
    editForm: {
      id: 0,
      productName: "",
      price: null,
      quantity: null,
      discount: null,
      category: "",
      image: "",
      desc: "",
    },
    activeProducts: [],
    modalOpen: false,
    switch: true,
  };

  getProductList = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ productList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderProductList = () => {
    return this.state.productList.map((val, idx) => {
      const {
        id,
        productName,
        price,
        quantity,
        discount,
        category,
        image,
        desc,
      } = val;
      return (
        <>
          <tr
            onClick={() => {
              if (this.state.activeProducts.includes(idx)) {
                this.setState({
                  activeProducts: [
                    ...this.state.activeProducts.filter((item) => item !== idx),
                  ],
                });
              } else {
                this.setState({
                  activeProducts: [...this.state.activeProducts, idx],
                });
              }
            }}
          >
            <td> {id} </td>
            <td> {productName} </td>
            <td>{category}</td>
            <td>
              {" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(price)}{" "}
            </td>
          </tr>
          <tr
            className={`collapse-item ${
              this.state.activeProducts.includes(idx) ? "active" : null
            }`}
          >
            <td className="" colSpan={3}>
              <div className="d-flex justify-content-around align-items-center">
                <div className="d-flex">
                  <img src={image} alt="" />
                  <div className="d-flex flex-column ml-4 justify-content-center">
                    <h5>{productName}</h5>
                    <h6 className="mt-2">
                      Category:
                      <span style={{ fontWeight: "normal" }}> {category}</span>
                    </h6>
                    <h6>
                      Price:
                      <span style={{ fontWeight: "normal" }}>
                        {" "}
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(price)}
                      </span>
                    </h6>
                    <h6>
                      Quantity:
                      <span style={{ fontWeight: "normal" }}> {quantity}</span>
                    </h6>
                    <h6>
                      Discount:
                      <span style={{ fontWeight: "normal" }}>
                        {" "}
                        {discount} %
                      </span>{" "}
                    </h6>
                    <h6>
                      Description:
                      <br></br>
                      <span style={{ fontWeight: "normal" }}> {desc}</span>
                    </h6>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-center pl-4 pr-5">
                  <ButtonUI
                    func={(_) => this.editBtnHandler(idx)}
                    type="contained"
                  >
                    Edit
                  </ButtonUI>
                  <ButtonUI
                    className="mt-3"
                    func={(_) => this.deleteBtnHandler(id)}
                    type="textual"
                  >
                    Delete
                  </ButtonUI>
                </div>
              </div>
            </td>
          </tr>
        </>
      );
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
    let arrTemp = this.state.productList;
    arrTemp.sort(this.sortArray(property));
    this.setState({
      productList: arrTemp,
    });
    this.renderProductList();
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    if (field === "price" || field === "quantity" || field === "discount") {
      this.setState({
        [form]: {
          ...this.state[form],
          [field]: parseInt(value),
        },
      });
    } else {
      this.setState({
        [form]: {
          ...this.state[form],
          [field]: value,
        },
      });
    }
  };

  createProductHandler = () => {
    Axios.post(`${API_URL}/products`, this.state.createForm)
      .then((res) => {
        swal("Success!", "Your item has been added to the list", "success");
        this.setState({
          createForm: {
            productName: "",
            price: null,
            quantity: null,
            discount: null,
            category: "Mountain Bike",
            image: "",
            desc: "",
            totalPurchased: 0,
          },
        });
        this.getProductList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be added to the list", "error");
      });
  };

  editBtnHandler = (idx) => {
    this.setState({
      editForm: {
        ...this.state.productList[idx],
      },
      modalOpen: true,
    });
  };

  editProductHandler = () => {
    Axios.put(
      `${API_URL}/products/${this.state.editForm.id}`,
      this.state.editForm
    )
      .then((res) => {
        swal("Success!", "Your item has been edited", "success");
        this.setState({ modalOpen: false });
        this.getProductList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be edited", "error");
        console.log(err);
      });
  };

  deleteBtnHandler = (idx) => {
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        Axios.delete(`${API_URL}/products/${idx}`)
          .then((res) => {
            swal("Poof! Your imaginary file has been deleted!", {
              icon: "success",
            });
            this.getProductList();
          })
          .catch((err) => {
            console.log(err);
            swal("Something went wrong...", {
              icon: "error",
            });
          });
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getProductList();
  }

  render() {
    return (
      <div className="container pt-4">
        <div className="dashboard">
          <caption className="p-3">
            <h2>Products</h2>
          </caption>
          <table className="dashboard-table p-3">
            <thead>
              <tr>
                <th onClick={(_) => this.dynamicSort("id")}>ID</th>
                <th onClick={(_) => this.dynamicSort("productName")}>Name</th>
                <th onClick={(_) => this.dynamicSort("category")}>Category</th>
                <th onClick={(_) => this.dynamicSort("price")}>Price</th>
              </tr>
            </thead>
            <tbody>{this.renderProductList()}</tbody>
          </table>
        </div>
        <div className="dashboard-form-container p-4">
          <caption className="mb-4 mt-2">
            <h2>Add Product</h2>
          </caption>
          <div className="row">
            <div className="col-12">
              <TextField
                value={this.state.createForm.productName}
                placeholder="Product Name"
                onChange={(e) =>
                  this.inputHandler(e, "productName", "createForm")
                }
              />
            </div>
            <div className="col-4 mt-3">
              <TextField
                value={this.state.createForm.price}
                placeholder="Price"
                onChange={(e) => this.inputHandler(e, "price", "createForm")}
              />
            </div>
            <div className="col-4 mt-3">
              <TextField
                value={this.state.createForm.quantity}
                placeholder="Quantity"
                onChange={(e) => this.inputHandler(e, "quantity", "createForm")}
              />
            </div>
            <div className="col-4 mt-3">
              <TextField
                value={this.state.createForm.discount}
                placeholder="Discount"
                onChange={(e) => this.inputHandler(e, "discount", "createForm")}
              />
            </div>
            <div className="col-8 mt-3">
              <TextField
                value={this.state.createForm.image}
                placeholder="Image Source"
                onChange={(e) => this.inputHandler(e, "image", "createForm")}
              />
            </div>
            <div className="col-4 mt-3">
              <select
                value={this.state.createForm.category}
                className="custom-text-input h-100 pl-3"
                onChange={(e) => this.inputHandler(e, "category", "createForm")}
              >
                <option value="MountainBike">Mountain Bike</option>
                <option value="Road Bike">Road Bike</option>
                <option value="Folded Bike">Folded Bike</option>
                <option value="Fixie">Fixie</option>
              </select>
            </div>
            <div className="col-12 mt-3">
              <textarea
                value={this.state.createForm.desc}
                onChange={(e) => this.inputHandler(e, "desc", "createForm")}
                style={{ resize: "none" }}
                placeholder="Description"
                className="custom-text-input"
              ></textarea>
            </div>
            <div className="col-3 mt-3">
              <ButtonUI func={this.createProductHandler} type="contained">
                Create Product
              </ButtonUI>
            </div>
          </div>
        </div>
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Edit Product</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                <TextField
                  value={this.state.editForm.productName}
                  placeholder="Product Name"
                  onChange={(e) =>
                    this.inputHandler(e, "productName", "editForm")
                  }
                />
              </div>
              <div className="col-4 mt-3">
                <TextField
                  value={this.state.editForm.price}
                  placeholder="Price"
                  onChange={(e) => this.inputHandler(e, "price", "editForm")}
                />
              </div>
              <div className="col-4 mt-3">
                <TextField
                  value={this.state.editForm.quantity}
                  placeholder="Quantity"
                  onChange={(e) => this.inputHandler(e, "quantity", "editForm")}
                />
              </div>
              <div className="col-4 mt-3">
                <TextField
                  value={this.state.editForm.discount}
                  placeholder="Discount"
                  onChange={(e) => this.inputHandler(e, "discount", "editForm")}
                />
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.image}
                  placeholder="Image Source"
                  onChange={(e) => this.inputHandler(e, "image", "editForm")}
                />
              </div>
              <div className="col-6 mt-3">
                <select
                  value={this.state.editForm.category}
                  className="custom-text-input h-100 pl-3"
                  onChange={(e) => this.inputHandler(e, "category", "editForm")}
                >
                  <option value="MountainBike">Mountain Bike</option>
                  <option value="Road Bike">Road Bike</option>
                  <option value="Folded Bike">Folded Bike</option>
                  <option value="Fixie">Fixie</option>
                </select>
              </div>
              <div className="col-12 mt-3">
                <textarea
                  value={this.state.editForm.desc}
                  onChange={(e) => this.inputHandler(e, "desc", "editForm")}
                  style={{ resize: "none" }}
                  placeholder="Description"
                  className="custom-text-input"
                ></textarea>
              </div>
              <div className="col-12 text-center my-3">
                <img src={this.state.editForm.image} alt="" />
              </div>
              <div className="col-5 mt-3 offset-1">
                <ButtonUI
                  className="w-100"
                  func={this.toggleModal}
                  type="outlined"
                >
                  Cancel
                </ButtonUI>
              </div>
              <div className="col-5 mt-3">
                <ButtonUI
                  className="w-100"
                  func={this.editProductHandler}
                  type="contained"
                >
                  Save
                </ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
export default AdminDashboard;
