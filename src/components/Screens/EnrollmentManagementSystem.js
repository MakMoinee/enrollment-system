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
import { format } from "date-fns";

const EnrollmentManagementSystem = ({ onLogout }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
  const [studentID, setStudentID] = useState("");
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [section, setSection] = useState("");
  const [enrolledDate, setEnrolledDate] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectModal, setSubjectModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState([]);

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

  useEffect(() => {
    fetch("http://localhost:3001/subjects")
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);

  const handleEnrollModalOpen = () => {
    setShowEnrollModal(true);
  };

  const handleShowSubjects = () => {
    navigate("/subjects");
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
    setEnrolledDate(
      format(new Date(selectedStudent.enrolledDate), "yyyy-MM-dd")
    );
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

  const handleSubjectModalClose = () => {
    setSubjectModal(false);
  };

  const handleShowSubjectsModal = (index) => {
    const tCourse = students[index].course;
    const tYear = students[index].yearLevel;
    console.log(tCourse);
    console.log(tYear);
    let subjectArr = [];
    subjects.forEach((el) => {
      if (el.course && el.yearLevel) {
        if (el.course === tCourse && el.yearLevel === tYear) {
          subjectArr.push(el);
        }
      }
    });
    console.log(subjectArr);
    setSelectedSubject(subjectArr);
    setSubjectModal(true);
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
    // onLogout();
    Swal.fire({
      icon: "success",
      title: "Successfully Logout",
    });
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

            <Button
              onClick={handleShowSubjects}
              variant="primary"
              className="ml-2"
              style={{ marginLeft: "10px" }}
            >
              Subjects
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
                  <td>
                    {format(new Date(student.enrolledDate), "yyyy-MM-dd")}
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      className="mr-2"
                      onClick={() => handleShowSubjectsModal(index)}
                    >
                      Show Subjects
                    </Button>
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

      {/* Subject Modal */}
      <Modal show={subjectModal} onHide={handleSubjectModalClose}>
        <Modal.Header>
          <Modal.Title>Associated Subjects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
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
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSubject.map((subject, index) => (
                      <tr key={index}>
                        <td>{subject.subjectCode}</td>
                        <td>{subject.subjectDescription}</td>
                        <td>{subject.subjectUnits}</td>
                        <td>{subject.course}</td>
                        <td>{subject.yearLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSubjectModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EnrollmentManagementSystem;
