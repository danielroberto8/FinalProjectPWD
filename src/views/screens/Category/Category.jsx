import React from "react";
import "./Category.css";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";

class Category extends React.Component {
  state = {
    editCat: "",
    category: "",
    modalOpen: false,
    categoryList: [],
  };

  componentDidMount = () => {
    this.getCategoryList();
  };

  getCategoryList = () => {
    Axios.get(`${API_URL}/category`)
      .then((res) => {
        this.setState({
          categoryList: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  inputHandler = (e, field) => {
    let value = e.target;
    this.setState({
      [field]: value,
    });
  };

  toggleModal = (editCat) => {
    this.setState({ modalOpen: !this.state.modalOpen, editCat });
  };

  saveBtnHandler = () => {
    Axios.post(`${API_URL}/category`, { category: this.state.category })
      .then((res) => {
        swal("Berhasil!", "Kategori baru sudah ditambahkan", "success");
        this.setState({
          categoryList: [],
        });
        this.getCategoryList();
      })
      .catch((err) => {
        swal("Oops...", "Kategori tidak berhasil ditambahkan", "error");
      });
  };

  renderCategoryList = () => {
    return this.state.categoryList.map((val) => {
      const { id, category } = val;
      return (
        <tr>
          <td>{id}</td>
          <td>{category}</td>
          <td>
            <ButtonUI type="contained" func={(_) => this.toggleModal(category)}>
              Edit
            </ButtonUI>
          </td>
          <td>
            <ButtonUI type="outlined">Delete</ButtonUI>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="container text-center pt-4 d-flex flex-column justify-content-center">
        <div className="category">
          <caption className="p-3">
            <h2>Category</h2>
          </caption>
          <table className="dashboard-table p-3">
            <thead>
              <th>no</th>
              <th>nama kategori</th>
              <th colspan="2">Actions</th>
            </thead>
            <tbody>{this.renderCategoryList()}</tbody>
          </table>
          <caption className="p-3">
            <h2>Tambah Category</h2>
          </caption>
          <div className="row ">
            <div className="col-6 d-flex flex-column justify-content-center">
              <TextField
                value={this.state.category}
                placeholder="Product Name"
                onChange={(e) => this.inputHandler(e, "category")}
              ></TextField>
              <ButtonUI
                className="mt-3"
                type="contained"
                func={this.saveBtnHandler}
              >
                Simpan
              </ButtonUI>
            </div>
          </div>
          <Modal toggle={this.toggleModal} isOpen={this.state.modalOpen}>
            <ModalHeader>
              <h2 className="text-secondary">Edit Category</h2>
            </ModalHeader>
            <ModalBody>
              <TextField
                value={this.state.editCat}
                placeholder="Category"
                onChange={(e) => this.inputHandler(e, "editCat")}
              ></TextField>
              <ButtonUI className="mt-3" type="contained">
                Update
              </ButtonUI>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Category;
