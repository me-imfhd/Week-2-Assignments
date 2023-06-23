/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express");
const fs = require("fs");
const PORT = 3000;
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
if (fs.existsSync("allUsers.json")) {
} else {
  const allUsers = [];
  fs.writeFile("allUsers.json", JSON.stringify(allUsers), (err) => {
    if (err) {
      console.error("allUsers.json not created");
    } else {
      console.log("allUsers.json created");
    }
  });
}
app.post("/signup", (req, res) => {
  const user = {
    id: Math.floor(Math.random() * 1000000),
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };
  fs.readFile("allUsers.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    try {
      const users = JSON.parse(data);

      users.push(user);

      fs.writeFile("allUsers.json", JSON.stringify(users), (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log("New object added to the file successfully");
        }
      });
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  });
  res.status(200).json(user);
  allUsers.push(user);
});
app.post("/login", (req, res) => {
  fs.readFile("./allusers.json", "utf-8", (err, data) => {
    if (err) {
      console.log("readFile not successful", err);
    } else {
      const thisUser = JSON.parse(data).find(
        (user) => req.headers.username === user.username
      );
      if (!thisUser) {
        return res.status(401).send("Username does not exists");
      }
      if (thisUser.password !== req.headers.password) {
        return res.status(401).send("Password unauthorized");
      }

      return res.status(200).json({
        id: thisUser.id,
        firstname: thisUser.firstname,
        lastname: thisUser.lastname,
      });
    }
  });
});

app.get("/data", (req, res) => {
  fs.readFile("./allusers.json", "utf-8", (err, data) => {
    if (err) {
      console.log("readFile not successful");
    } else {
      console.log("file read successful");
      return res.status(200).send(data);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Listening to port number ${PORT}`);
});
module.exports = app;
