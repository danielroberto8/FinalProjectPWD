import React from "react";
import { connect } from "react-redux";
import { logoutHandler, searchHandler } from "../../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUserAstronaut,
  faSearch,
} from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Logo from "../../../assets/images/Logo.png";
import "./Navbar.css";
import { Link } from "react-router-dom";
import ButtonUI from "../Button/Button.tsx";
import swal from "sweetalert";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searchBarInput: "",
    dropdownOpen: false,
    modalOpen: false,
  };

  searchBarInputHandler = (e) => {
    const res = e.target.value.toLowerCase();
    this.setState({
      searchBarInput: res,
    });
    this.props.searchHandler(res);
  };

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  logoutHandler = () => {
    swal({
      title: "Apa anda yakin ingin keluar?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.props.logoutHandler();
        }
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

  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text logo-color">
          <Link to="/">
            <img
              className="img-fluid"
              style={{ height: 60, width: 180 }}
              alt="logo"
              src={Logo}
            />
          </Link>
        </div>
        <div
          className="d-flex flex-row align-items-center"
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon
            className="mr-4 iconColor"
            icon={faSearch}
            style={{ fontSize: 24 }}
            onClick={this.toggleModal}
          />
          {this.props.user.id ? (
            <>
              <Link to="/cart">
                <FontAwesomeIcon
                  className="mr-2 iconColor"
                  icon={faShoppingCart}
                  style={{ fontSize: 24 }}
                />
              </Link>
              <CircleBg>
                <small style={{ color: "#c17a80", fontWeight: "bold" }}>
                  {this.props.cart.cartQty}
                </small>
              </CircleBg>
              <Dropdown
                toggle={this.toggleDropdown}
                isOpen={this.state.dropdownOpen}
              >
                <DropdownToggle tag="div" className="d-flex ml-3">
                  <FontAwesomeIcon
                    icon={faUserAstronaut}
                    style={{ fontSize: 24 }}
                    className="iconColor"
                  />
                </DropdownToggle>
                <DropdownMenu className="mt-2 iconColor">
                  <DropdownItem>
                    <Link
                      style={{ color: "inherit", textDecoration: "none" }}
                      to={`/profile/${this.props.user.username}`}
                    >
                      Profile
                    </Link>
                  </DropdownItem>
                  {this.props.user.role === "admin" ? (
                    <>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/dashboard"
                        >
                          Dashboard
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/member"
                        >
                          Members
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/payment"
                        >
                          Payments
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/report"
                        >
                          Report
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/auth/login"
                          onClick={this.logoutHandler}
                        >
                          Logout
                        </Link>
                      </DropdownItem>
                    </>
                  ) : (
                    <>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/transaction"
                        >
                          Transaction
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/auth/login"
                          onClick={this.logoutHandler}
                        >
                          Logout
                        </Link>
                      </DropdownItem>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <Link to="/auth/login">
                <ButtonUI className="mr-3" type="textual">
                  Sign in
                </ButtonUI>
              </Link>
              <Link to="/auth/register">
                <ButtonUI type="contained">Sign up</ButtonUI>
              </Link>
            </>
          )}
        </div>
        <Modal toggle={this.toggleModal} isOpen={this.state.modalOpen}>
          <ModalHeader>
            <h3 className="text-secondary">Cari sepeda impianmu</h3>
          </ModalHeader>
          <ModalBody>
            <div
              style={{ flex: 1 }}
              className="px-5 d-flex flex-row justify-content-start"
            >
              <input
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                value={this.props.search.searchTerm}
                className={`search-bar ${
                  this.state.searchBarIsFocused ? "active" : null
                }`}
                type="text"
                onChange={(e) => {
                  this.searchBarInputHandler(e);
                }}
              />
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    search: state.search,
    cart: state.cart,
  };
};

export default connect(mapStateToProps, { logoutHandler, searchHandler })(
  Navbar
);
