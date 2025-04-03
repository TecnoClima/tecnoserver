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

    if (plant) {
      newUser.plant = await Plant.findOne({ name: plant });
      if (!newUser.plant) newUser.plant = await Plant.findById(plant);
    }
    newUser.active = true;
    newUser.access = access || "Client";

    //hashing password
    if (password) newUser.password = await setPassword(password);

    if (charge) newUser.charge = charge;
    const newItem = await User(newUser);
    // res.status(200).send({ success: newItem });

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
    if (!user)
      throw new Error(
        "Usuario o Contraseña incorrecta, intente de nuevo por favor"
      );
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
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

function getUserFromToken(req) {
  const token = req.headers.authorization.split(" ")[1];
  return jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) throw new Error("Access denied: Token expired or incorrect");
    return user;
  });
}

async function getFullUserFromToken(req) {
  const token = req.headers.authorization.split(" ")[1];
  const data = jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) throw new Error("Access denied: Token expired or incorrect");
    return user;
  });
  return await User.findOne({ idNumber: data.id }).populate("plant");
}

async function getUserData(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        console.log(err);
        res
          .status(400)
          .send({ error: "Access denied: Token expired or incorrect" });
      } else {
        res.status(200).send(user);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.SECRET_KEY);
}

function validateToken(req, res, next) {
  const { method } = req;
  try {
    const url = req.url.split("?")[0];
    const authEndpoint = "/users/auth";
    const publicGetEndpoints = [
      "/devices/id",
      "/devices/history",
      "/plants",
      "/areas",
      "/dates/plan",
      "/lines",
      "/strategies",
      "/servicePoints",
    ];
    const accessToken = req.headers.authorization.split(" ")[1];
    if (
      (url !== authEndpoint &&
        !(publicGetEndpoints.includes(url) && method === "GET")) ||
      (accessToken && url === "/dates/plan")
    ) {
      const accessToken = req.headers.authorization.split(" ")[1];
      if (!accessToken) res.status(400).send({ error: "Access Denied" });

      jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
        if (err) {
          res.status(400).send({
            error:
              "Access denied: Token expired or incorrect - ValidationToken",
          });
        } else {
          req.tokenData = user;
          next();
        }
      });
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function updateUser(req, res) {
  try {
    const { id, update } = req.body;
    const { idNumber } = req.params;
    const user =
      typeof id === "number"
        ? await User.findOne({ idNumber: id })
        : await User.findById(id);
    if (update.currentPassword) {
      if (await bcrypt.compare(update.currentPassword, user.password)) {
        update.password = update.newPassword;
      } else {
        throw new Error("La contraseña actual es incorrecta.");
      }
    }

    if (update.password) update.password = await setPassword(update.password);
    if (update.plant)
      update.plant = await Plant.findOne({ name: update.plant });
    await User.findByIdAndUpdate(user._id, update);
    const updated = await User.findById(user._id).populate("plant");
    const result = {
      ...updated._doc,
      plant: updated._doc.plant ? updated._doc.plant.name : undefined,
    };
    res.status(200).send({ success: result });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function getUsersList(req, res) {
  try {
    const { access, charge, id, plant } = req.query;
    const plantName = plant || req.tokenData.plant;
    const filters = { access, charge };
    if (id) filters.idNumber = Number(id);
    if (!req.query.active) filters.active = true;
    if (plantName && req.tokenData.access !== "Admin")
      filters.plant = await Plant.findOne({ name: plantName });
    for (let key of Object.keys(filters))
      if (!filters[key]) delete filters[key];
    const users = await User.find(filters).populate("plant");
    const array = users.map((user) => ({
      ...user._doc,
      plant: user._doc.plant ? user._doc.plant.name : undefined,
    }));
    array.map((user) => {
      delete user.password;
      return user;
    });

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
  validateToken,
  getUserFromToken,
  getFullUserFromToken,

  addUser,
  login,
  getUserData,
  updateUser,
  getUsersList,
  getUserOptions,
  filterUser,
  setPassword,
};
