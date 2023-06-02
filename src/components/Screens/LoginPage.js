import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
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
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const isUserLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (isUserLoggedIn) {
      navigate("/enroll");
    }
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleLogin = () => {
    const { email, password } = formValues;

    // Perform validation
    const errors = validateLoginForm();
    if (Object.keys(errors).length === 0) {
      // Send login request to API
      sendLoginRequest(email, password);
    } else {
      setValidationErrors(errors);
    }
  };

  const handleCreateAccount = () => {
    const {
      email,
      password,
      firstName,
      middleName,
      lastName,
      address,
      birthDate,
      phoneNumber,
    } = formValues;

    // Perform validation
    const errors = validateCreateAccountForm();
    if (Object.keys(errors).length === 0) {
      // Send create account request to API
      sendCreateAccountRequest(
        email,
        password,
        firstName,
        middleName,
        lastName,
        address,
        birthDate,
        phoneNumber
      );
    } else {
      setValidationErrors(errors);
    }
  };

  const sendLoginRequest = (email, password) => {
    // Replace with your API logic
    // Example: Sending a POST request to /api/login with email and password
    fetch("http://localhost:3001/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message) {
          if (data.message === "Wrong Username or Password") {
            Swal.fire({
              icon: "error",
              title: "Login Failed",
              text: "An error occurred during login",
              showConfirmButton: false,
              timer: 800,
            });
          } else {
            // Simulating a successful login
            onLogin();
            sessionStorage.setItem("isLoggedIn", "true");

            Swal.fire({
              icon: "success",
              title: "Login Successful",
              showConfirmButton: false,
              timer: 1500,
            });

            navigate("/enroll");
          }
        }
      })
      .catch((error) => {
        console.log(error);
        // Handle login error here
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "An error occurred during login",
        });
      });
  };

  const sendCreateAccountRequest = (
    email,
    password,
    firstName,
    middleName,
    lastName,
    address,
    birthDate,
    phoneNumber
  ) => {
    // Replace with your API logic
    // Example: Sending a POST request to /api/create-account with form data
    fetch("http://localhost:3001/createAccount", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        firstName,
        middleName,
        lastName,
        address,
        birthDate,
        phoneNumber,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Simulating a successful account creation
        Swal.fire({
          icon: "success",
          title: "Account Created",
          text: "Your account has been created successfully",
        });
        handleCloseModal();
      })
      .catch((error) => {
        console.log(error);
        // Handle create account error here
        Swal.fire({
          icon: "error",
          title: "Account Creation Failed",
          text: "An error occurred during account creation",
        });
      });
  };

  const validateLoginForm = () => {
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

  const validateCreateAccountForm = () => {
    const errors = {};

    if (!formValues.email) {
      errors.email = "This field is required";
    } else if (!isValidEmail(formValues.email)) {
      errors.email = "Email is not valid";
    }

    if (!formValues.password) {
      errors.password = "This field is required";
    }

    if (!formValues.firstName) {
      errors.firstName = "This field is required";
    }

    if (!formValues.lastName) {
      errors.lastName = "This field is required";
    }

    if (!formValues.address) {
      errors.address = "This field is required";
    }

    if (!formValues.birthDate) {
      errors.birthDate = "This field is required";
    }

    if (!formValues.phoneNumber) {
      errors.phoneNumber = "This field is required";
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

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="login-form">
        <h1 className="text-center mb-4">EMS Login</h1>

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
            style={{ width: "220px" }}
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
            style={{ width: "220px" }}
          />
          {validationErrors.password && (
            <Form.Text className="text-danger">
              {validationErrors.password}
            </Form.Text>
          )}
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
          <Button
            variant="secondary"
            onClick={handleShowModal}
            style={{ marginLeft: "20px" }}
          >
            Create Account
          </Button>
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  required
                />
                {validationErrors.email && (
                  <Form.Text className="text-danger">
                    {validationErrors.email}
                  </Form.Text>
                )}
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
                {validationErrors.password && (
                  <Form.Text className="text-danger">
                    {validationErrors.password}
                  </Form.Text>
                )}
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
                {validationErrors.firstName && (
                  <Form.Text className="text-danger">
                    {validationErrors.firstName}
                  </Form.Text>
                )}
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
                {validationErrors.lastName && (
                  <Form.Text className="text-danger">
                    {validationErrors.lastName}
                  </Form.Text>
                )}
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
                {validationErrors.address && (
                  <Form.Text className="text-danger">
                    {validationErrors.address}
                  </Form.Text>
                )}
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
                {validationErrors.birthDate && (
                  <Form.Text className="text-danger">
                    {validationErrors.birthDate}
                  </Form.Text>
                )}
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
                {validationErrors.phoneNumber && (
                  <Form.Text className="text-danger">
                    {validationErrors.phoneNumber}
                  </Form.Text>
                )}
              </Form.Group>

              <Button variant="primary" onClick={handleCreateAccount}>
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
