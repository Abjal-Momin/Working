const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "afzalmomin";

const app = express();
app.use(express.json());

const users = [];

function logged(req, res, next) {
  console.log(`${req.method} request came`);
  next();
}

app.post("/signup", logged, function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const userExist = users.find((user) => user.username == username);

  if (userExist) {
    res.status(403).send({
      message: "User Name exists Try different one",
    });
  } else {
    users.push({
      username: username,
      password: password,
    });

    res.json({
      message: "You have signed up",
    });
  }
});

app.post("/signin", logged, function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  let foundUser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username && users[i].password == password) {
      foundUser = users[i];
    }
  }

  if (foundUser) {
    const token = jwt.sign(
      {
        username: foundUser.username,
      },
      JWT_SECRET
    );
    res.header("token", token);

    res.json({
      token: token,
    });
  } else {
    res.status(403).send({
      message: "Invalid username or password",
    });
  }
  // console.log(users);
});

function auth(req, res, next) {
  const token = req.headers.token;
  const decodedInformation = jwt.verify(token, JWT_SECRET);
  const username = decodedInformation.username;

  if (username) {
    req.username = username;
    next();
  } else {
    res.json({
      message: "your not logged in",
    });
  }
}

app.get("/me", auth, function (req, res) {
  let foundUser = users.find((user) => user.username == req.username);
  // find will only find one element in entire array

  if (foundUser) {
    res.json({
      username: foundUser.username,
      password: foundUser.password,
    });
  } else
    res.status(401).send({
      message: "Invalid token",
    });
});

app.listen(3000);
