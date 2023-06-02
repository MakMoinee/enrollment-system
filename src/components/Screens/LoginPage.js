import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import EnrollmentManagementSystem from "./EnrollmentManagementSystem";

const LoginPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    birthDate: "",
    phoneNumber: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(isUserLoggedIn);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = () => {
    const { email, password } = formValues;

    // Perform validation
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      // Simulating a successful login
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      setValidationErrors(errors);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formValues.email) {
      errors.email = "This field is required";
    } else if (!isValidEmail(formValues.email)) {
      errors.email = "Email is not valid";
    }

    if (!formValues.password) {
      errors.password = "This field is required";
    }

    return errors;
  };

  const isValidEmail = (email) => {
    // Add your email validation logic here
    // This is a simple example, you can use a library or a regex pattern for validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (isLoggedIn) {
    return <EnrollmentManagementSystem />;
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="login-form">
        <h1 className="text-center mb-4">Login Page</h1>

        <Form.Group
          controlId="email"
          className="mb-3"
          error={!!validationErrors.email}
        >
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
            required
            style={{ width: "200px" }}
          />
          {validationErrors.email && (
            <Form.Text className="text-danger">
              {validationErrors.email}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group
          controlId="password"
          className="mb-3"
          error={!!validationErrors.password}
        >
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleInputChange}
            required
            style={{ width: "200px" }}
          />
          {validationErrors.password && (
            <Form.Text className="text-danger">
              {validationErrors.password}
            </Form.Text>
          )}
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleSubmit}>
            Login
          </Button>
          <Button variant="secondary" onClick={handleShowModal}>
            Create Account
          </Button>
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="middleName">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  name="middleName"
                  value={formValues.middleName}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formValues.address}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="birthDate">
                <Form.Label>Birth Date</Form.Label>
                <Form.Control
                  type="date"
                  name="birthDate"
                  value={formValues.birthDate}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="phoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={formValues.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Create
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;
