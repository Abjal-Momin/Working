const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "afzalmomin";
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const users = [];

function logged(req, res, next) {
  console.log(`${req.method} request came`);
  next();
}

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", logged, function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  users.push({
    username: username,
    password: password,
  });

  res.json({
    message: "You have signed up",
  });
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

app.get("/me", function (req, res) {
  const token = req.headers.token;
  const decodedInformation = jwt.verify(token, JWT_SECRET);
  const username = decodedInformation.username;

  // let foundUser = null;
  // for (let i = 0; i < users.length; i++) {
  //   if (users[i].username == username) {
  //     foundUser = users[i];
  //   }
  // }

  let foundUser = users.find((user) => user.username == username);

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
