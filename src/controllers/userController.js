const Plant = require("../models/Plant");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserOptions = require("../models/UserOptions");

function buildUser(user) {
  const { idNumber, name, access, charge, email, phone, plant, active } = user;
  return {
    id: idNumber,
    idNumber,
    name,
    access,
    charge,
    email,
    phone,
    active,
    plant: plant.name,
  };
}

async function setPassword(string) {
  const ronda = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(string, ronda);
  return hash;
}

async function addUser(req, res) {
  console.log(req.body, "req.body");
  try {
    const {
      charge,

      name,
      idNumber,
      password,
      email,
      phone,
      plant,
      access,
    } = req.body;
    let { username } = req.body;
    if (await User.findOne({ idNumber }))
      throw new Error("DNI actualmente en uso");
    if (!username) {
      username = "";
      let nameWords = name.split(" ");
      for (i = 0; i < nameWords.length; i++) {
        username += i === nameWords.length - 1 ? nameWords[i] : nameWords[i][0];
      }
      username = username.toLowerCase();
      let count = 1;
      let checkUserName = await User.find({
        username: { $regex: "^" + username },
      });
      while (checkUserName.length > 0) {
        count = checkUserName.length + 1;
        checkUserName = await User.find({
          username: { $regex: "^" + username + count },
        });
      }
      if (count > 1) username += count;
    }
    const newUser = { name, idNumber, email, phone };
    newUser.username = username;
    newUser.plant = await Plant.findById(plant);
    newUser.active = true;
    newUser.access = access || "Client";

    //hashing password
    if (password) newUser.password = await setPassword(password);

    if (charge) newUser.charge = charge;
    const newItem = await User(newUser);
    const itemStored = await newItem.save();
    res.status(200).send({ success: itemStored });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username }).populate("plant");
    const tokenInput = {
      user: username,
      access: user.access,
      id: user.idNumber,
    };
    if (user.plant) tokenInput.plant = user.plant.name;
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      throw new Error(
        "Usuario o Contraseña incorrecta, intente de nuevo por favor"
      );
    const accessToken = generateAccessToken(tokenInput);
    res.status(200).send({
      success: {
        access: user.access,
        plant: user.plant ? user.plant.name : undefined,
        token: accessToken,
      },
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function getUserData(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token", token);
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        res
          .status(400)
          .send({ error: "Access denied: Token expired or incorrect" });
      } else {
        res.status(200).send(user);
      }
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.SECRET_KEY);
}

function validateToken(req, res, next) {
  try {
    const accessToken = req.headers["authorization"];
    if (!accesToken) res.send("Access Denied");
    jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        res.send("Access denied: Token expired or incorrect");
      } else {
        next();
      }
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function updateUser(req, res) {
  try {
    const { id, update } = req.body;
    const { idNumber } = req.params;
    console.log("req.body", req.body);
    const user =
      typeof id === "number"
        ? await User.findOne({ idNumber: id })
        : await User.findById(id);
    console.log("user", user.username);
    if (update.currentPassword) {
      if (await bcrypt.compare(update.currentPassword, user.password)) {
        update.password = update.newPassword;
      } else {
        throw new Error("La contraseña actual es incorrecta.");
      }
    }

    if (update.password) update.password = await setPassword(update.password);
    if (update.plantName)
      update.plantName = await Plant.findOne({ name: plantName });
    await User.findByIdAndUpdate(user._id, update);
    const updated = await User.findById(user._id).populate("plant");
    const result = {
      ...updated._doc,
      plant: updated._doc.plant ? updated._doc.plant.name : undefined,
    };
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function getUsersList(req, res) {
  try {
    const { access, charge, id, plant } = req.query;
    const filters = { access, charge };
    if (id) filters.idNumber = Number(id);
    if (!req.query.active) filters.active = true;
    if (plant) filters.plant = await Plant.findOne({ name: plant });

    for (let key of Object.keys(filters))
      if (!filters[key]) delete filters[key];
    const users = await User.find(filters).populate("plant");
    const array = users.map((user) => ({
      ...user._doc,
      plant: user._doc.plant ? user._doc.plant.name : undefined,
    }));

    res.status(200).send(array);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}
async function getUserOptions(req, res) {
  try {
    const options = await UserOptions.findOne();
    res.status(200).send(options);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function filterUser(req, res) {
  console.log("filterUser", req.body);
  try {
    const { filters } = req.body;
    if (filters.plant) {
      const plantId = (await Plant.findOne({ name: filters.plant }))._id;
      if (plantId) filters.plant = plantId;
    }
    const users = await User.find(filters).populate("plant");
    res.status(200).send(users);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

module.exports = {
  addUser,
  login,
  getUserData,
  updateUser,
  getUsersList,
  getUserOptions,
  filterUser,
  setPassword,
};
