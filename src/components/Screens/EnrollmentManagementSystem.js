import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { format } from 'date-fns';

const EnrollmentManagementSystem = ({ onLogout }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
  const [studentID, setStudentID] = useState("");
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [section, setSection] = useState("");
  const [enrolledDate, setEnrolledDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/enrollment")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error Fetching Students",
          text: "Failed to fetch student data. Please try again later.",
        });
        console.error("Error fetching students:", error);
      });
  }, []);

  const handleEnrollModalOpen = () => {
    setShowEnrollModal(true);
  };

  const handleEnrollModalClose = () => {
    setShowEnrollModal(false);
  };

  const handleUpdateModalOpen = (index) => {
    const selectedStudent = students[index];
    setSelectedStudentIndex(index);
    setStudentID(selectedStudent.studentID);
    setStudentName(selectedStudent.studentName);
    setCourse(selectedStudent.course);
    setYearLevel(selectedStudent.yearLevel);
    setSection(selectedStudent.section);
    setEnrolledDate(format(new Date(selectedStudent.enrolledDate), 'yyyy-MM-dd'));
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
  };

  const handleAddStudent = () => {
    fetch("http://localhost:3001/enrollment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: studentName,
        course,
        yearLevel,
        section,
        enrolledDate,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setNewStudent([]);
          Swal.fire({
            icon: "success",
            title: "Enrollment Successful",
            text: "Student has been enrolled.",
            timer: 500,
            showConfirmButton: false,
          });
          return response.json();
        } else {
          throw new Error("Failed to enroll student.");
        }
      })
      .then((data) => {
        setShowEnrollModal(false);
        fetch("http://localhost:3001/enrollment")
          .then((response) => response.json())
          .then((data) => {
            setStudents(data);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error Fetching Students",
              text: "Failed to fetch student data. Please try again later.",
            });
            console.error("Error fetching students:", error);
          });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Enrollment Error",
          text: "Failed to enroll student. Please try again later.",
        });
        console.error("Error enrolling student:", error);
      });
  };

  const handleRemoveStudent = (index) => {
    const studentId = students[index].enrollmentID;
    fetch(`http://localhost:3001/enrollment/${studentId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Removal Successful",
            text: "Student has been removed.",
            timer: 500,
            showConfirmButton: false,
          });
          return response.json();
        } else {
          throw new Error("Failed to remove student.");
        }
      })
      .then((data) => {
        fetch("http://localhost:3001/enrollment")
          .then((response) => response.json())
          .then((data) => {
            setStudents(data);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error Fetching Students",
              text: "Failed to fetch student data. Please try again later.",
            });
            console.error("Error fetching students:", error);
          });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Removal Error",
          text: "Failed to remove student. Please try again later.",
        });
        console.error("Error removing student:", error);
      });
  };

  const handleUpdateStudent = () => {
    const studentId = students[selectedStudentIndex].enrollmentID;
    fetch(`http://localhost:3001/enrollment/${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: studentName,
        course,
        yearLevel,
        section,
        enrolledDate,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setShowUpdateModal(false);
          Swal.fire({
            icon: "success",
            title: "Update Successful",
            text: "Student record has been updated.",
          });
          return response.json();
        } else {
          throw new Error("Failed to update student.");
        }
      })
      .then((data) => {
        setShowUpdateModal(false);
        fetch("http://localhost:3001/enrollment")
          .then((response) => response.json())
          .then((data) => {
            setStudents(data);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error Fetching Students",
              text: "Failed to fetch student data. Please try again later.",
            });
            console.error("Error fetching students:", error);
          });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Update Error",
          text: "Failed to update student. Please try again later.",
        });
        console.error("Error updating student:", error);
      });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    onLogout();
    navigate("/");
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-end">
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <h1>Enrollment Management System</h1>
      <Row className="mt-3">
        <Col xs={6}>
          <Form.Group className="d-flex">
            <Button
              onClick={handleEnrollModalOpen}
              variant="primary"
              className="ml-2"
            >
              Add Enrollment
            </Button>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Year Level</th>
                <th>Section</th>
                <th>Enrolled Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{student.studentID}</td>
                  <td>{student.studentName}</td>
                  <td>{student.course}</td>
                  <td>{student.yearLevel}</td>
                  <td>{student.section}</td>
                  <td>{format(new Date(student.enrolledDate), 'yyyy-MM-dd')}</td>
                  <td>
                    <Button
                      variant="primary"
                      className="mr-2"
                      onClick={() => handleUpdateModalOpen(index)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveStudent(index)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Enroll Modal */}
      <Modal show={showEnrollModal} onHide={handleEnrollModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enroll Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formStudentName">
            <Form.Label>Student Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCourse">
            <Form.Label>Course</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formYearLevel">
            <Form.Label>Year Level</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Year Level"
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formSection">
            <Form.Label>Section</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEnrolledDate">
            <Form.Label>Enrolled Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter Enrolled Date"
              value={enrolledDate}
              onChange={(e) => setEnrolledDate(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEnrollModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddStudent}>
            Enroll
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formStudentID">
            <Form.Label>Student ID</Form.Label>
            <Form.Control
              type="text"
              readOnly
              placeholder="Enter Student ID"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formStudentName">
            <Form.Label>Student Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCourse">
            <Form.Label>Course</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formYearLevel">
            <Form.Label>Year Level</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Year Level"
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formSection">
            <Form.Label>Section</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEnrolledDate">
            <Form.Label>Enrolled Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter Enrolled Date"
              value={enrolledDate}
              onChange={(e) => setEnrolledDate(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUpdateModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateStudent}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EnrollmentManagementSystem;
