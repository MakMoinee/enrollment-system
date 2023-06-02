const mysql = require("mysql");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Develop@2021",
  database: "enrollmentdb",
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

const fetchStudents = (callback) => {
  connection.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.error("Error fetching students:", err);
    } else {
      callback(results);
    }
  });
};

const addStudent = (name, callback) => {
  connection.query(
    "INSERT INTO students (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) {
        console.error("Error adding student:", err);
      } else {
        console.log("Student added to the database");
        callback();
      }
    }
  );
};

const removeStudent = (studentId, callback) => {
  connection.query(
    "DELETE FROM students WHERE id = ?",
    [studentId],
    (err, result) => {
      if (err) {
        console.error("Error removing student:", err);
      } else {
        console.log("Student removed from the database");
        callback();
      }
    }
  );
};

const updateStudent = (studentId, updatedName, callback) => {
  connection.query(
    "UPDATE students SET name = ? WHERE id = ?",
    [updatedName, studentId],
    (err, result) => {
      if (err) {
        console.error("Error updating student:", err);
      } else {
        console.log("Student updated in the database");
        callback();
      }
    }
  );
};

const loginUser = (email, password, callback) => {
  connection.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error("Error logging in:", err);
      } else {
        if (results.length > 0) {
          callback(true);
        } else {
          callback(false);
        }
      }
    }
  );
};

module.exports = {
  fetchStudents,
  addStudent,
  removeStudent,
  updateStudent,
  loginUser,
  connection,
};
