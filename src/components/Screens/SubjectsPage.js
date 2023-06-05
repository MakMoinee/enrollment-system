import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function SubjectsPage({ logoutClick }) {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectDesc, setSubjectDesc] = useState("");
  const [subjectUnits, setSubjectUnits] = useState(0);
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/subjects")
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error Fetching Subjects",
          text: "Failed to fetch subjects data. Please try again later.",
        });
        console.error("Error fetching subjects:", error);
      });
  }, []);
  const handleLogout = () => {
    sessionStorage.clear();
    // onLogout();
    Swal.fire({
      icon: "success",
      title: "Successfully Logout",
    });
    navigate("/");
  };
  const handleGoBack = () => {
    navigate("/");
  };

  const handleShowAddSubjectModal = () => {
    setShowAddSubjectModal(true);
  };

  const handleAddStudentClose = () => {
    setShowAddSubjectModal(false);
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  }

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  const handleAddSubject = () => {
    fetch("http://localhost:3001/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subjectCode,
        subjectDesc,
        subjectUnits,
        course,
        yearLevel,
      }),
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Successfully Added Subject",
            timer: 500,
            showConfirmButton: false,
          });
          return response.json();
        } else {
          throw new Error("Failed to add subject");
        }
      })
      .then((data) => {
        setShowAddSubjectModal(false);
        setSubjects([]);
        fetch("http://localhost:3001/subjects")
          .then((response) => response.json())
          .then((data) => {
            setSubjects(data);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error Fetching Subjects",
              text: "Failed to fetch subject data. Please try again later.",
            });
            console.error("Error fetching Subjects:", error);
          });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Subjects Error",
          text: "Failed to add subject. Please try again later.",
        });
        console.error("Error adding subject:", error);
      });
  };

  const handleRemoveSubject = (index) =>{
    setDeleteIndex(index);
    handleShowDeleteModal();
  }

  const handleDelete = () =>{
    const subjectID = subjects[deleteIndex].subjectID;
    fetch(`http://localhost:3001/subjects/${subjectID}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Removal Successful",
            text: "Subject has been removed.",
            timer: 500,
            showConfirmButton: false,
          });
          return response.json();
        } else {
          throw new Error("Failed to remove subject.");
        }
      })
      .then((data) => {
        setDeleteIndex(-1);
        setShowDeleteModal(false);
        setSubjects([]);
        fetch("http://localhost:3001/subjects")
          .then((response) => response.json())
          .then((data) => {
            setSubjects(data);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error Fetching Subjects",
              text: "Failed to fetch subject data. Please try again later.",
            });
            console.error("Error fetching Subjects:", error);
          });
      })
      .catch((error) => {
        setDeleteIndex(-1);
        Swal.fire({
          icon: "error",
          title: "Removal Error",
          text: "Failed to remove Subject. Please try again later.",
        });
        console.error("Error removing Subject:", error);
      });
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-end">
        <Button variant="primary" onClick={handleGoBack}>
          Go Back
        </Button>
        <Button
          variant="danger"
          onClick={handleLogout}
          style={{ marginLeft: "10px" }}
        >
          Logout
        </Button>
      </div>
      <h1>Subjects</h1>
      <Row className="mt-3">
        <Col xs={6}>
          <Form.Group className="d-flex">
            <Button variant="primary" onClick={handleShowAddSubjectModal}>
              Add Subject
            </Button>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Description</th>
                <th>Units</th>
                <th>Course</th>
                <th>Year Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index}>
                  <td>{subject.subjectCode}</td>
                  <td>{subject.subjectDescription}</td>
                  <td>{subject.subjectUnits}</td>
                  <td>{subject.course}</td>
                  <td>{subject.yearLevel}</td>
                  <td>
                    <Button
                      variant="success"
                      className="mr-2"
                      onClick={() => console.log("Primary")}
                    >
                      View/Update
                    </Button>
                    <Button
                      variant="danger"
                      className="mr-2"
                      onClick={() => handleRemoveSubject(index)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Enroll Modal */}
      <Modal show={showAddSubjectModal} onHide={handleAddStudentClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formSubjectCode">
            <Form.Label>Subject Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Subject Code"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="formSubjectDescription">
            <Form.Label>Subject Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Subject Description"
              value={subjectDesc}
              onChange={(e) => setSubjectDesc(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="formSubjectUnits">
            <Form.Label>Units</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Units"
              value={subjectUnits}
              onChange={(e) => setSubjectUnits(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCourse">
            <Form.Label>Course</Form.Label>
            <Form.Select
              aria-label="Select Available Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="">Select Available Course</option>
              <option value="BSIT">BSIT</option>
              <option value="BSBA">BSBA</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formYearLevel">
            <Form.Label>Year Level</Form.Label>
            <Form.Select
              aria-label="Select Year Level"
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
            >
              <option value="">Select Year Level</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="5th Year">5th Year</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddStudentClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSubject}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
            <Modal.Body>
              <Form.Group controlId="formDeleteLabel">
                <h3>Are You Sure You Want To Delete This Subject ?</h3>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Yes, Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SubjectsPage;
