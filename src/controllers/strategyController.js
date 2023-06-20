const User = require("../models/User");
const Plant = require("../models/Plant");
const Strategy = require("../models/Strategy");
const Task = require("../models/Task");

function buildStrategy(strategy) {
  let { _id, name, year, description } = strategy;
  const newItem = { id: _id, name, year, description };
  newItem.plant = strategy.plant.name;
  newItem.supervisor = {
    id: strategy.supervisor.idNumber,
    name: strategy.supervisor.name,
  };
  newItem.people = strategy.people.map((worker) => ({
    id: worker.idNumber,
    name: worker.name,
  }));
  return newItem;
}

async function createStrategy(req, res) {
  try {
    const { name, people, year, description } = req.body;
    const plant = (await Plant.findOne({ name: req.body.plant }))._id;
    const checkStrategy = await Strategy.findOne({
      name,
      year,
      plant: plant._id,
    });
    if (checkStrategy)
      throw new Error("El programa ya existe para esa planta y ese año");
    const supervisor = await User.findOne({
      idNumber: Number(req.body.supervisor),
    });
    const workers = await User.find({ idNumber: people });
    const data = {
      plant,
      year,
      name,
      description,
      supervisor: supervisor ? supervisor._id : undefined,
      people: workers ? workers.map((e) => e._id) : undefined,
    };
    const newStrategy = await Strategy(data);
    const stored = await newStrategy.save();
    res.status(200).send({
      success: buildStrategy(
        await Strategy.findOne({ _id: stored._id }).populate([
          {
            path: "plant",
            select: "name",
          },
          { path: "supervisor" },
          { path: "people" },
        ])
      ),
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function updateStrategy(req, res) {
  try {
    const strategy = req.body;

    const update = {};
    if (strategy.name) update.name = strategy.name;
    if (strategy.plant)
      update.plant = (await Plant.findOne({ name: strategy.plant }))._id;
    if (strategy.supervisor)
      update.supervisor = (
        await User.findOne({
          idNumber: Number(strategy.supervisor.id || strategy.supervisor),
        })
      )._id;
    if (strategy.people)
      update.people = (
        await User.find({ idNumber: strategy.people.map((e) => e.id || e) })
      ).map((u) => u._id);
    if (strategy.description) update.description = strategy.description;
    if (strategy.year) update.year = Number(strategy.year);
    await Strategy.findByIdAndUpdate(strategy.id, update);

    const updated = await Strategy.findById(strategy.id).populate([
      "plant",
      "supervisor",
      "people",
    ]);

    res.status(200).send({ success: buildStrategy(updated) });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function getStrategies(req, res) {
  try {
    const { year } = req.query;
    const plant = (
      await Plant.find(req.query.plant ? { name: req.query.plant } : {})
    ).map((plant) => plant._id);
    const filters = { plant };
    if (year) filters.year = year;
    const strategies = await Strategy.find(filters).populate([
      "plant",
      "supervisor",
      "people",
    ]);
    res.status(200).send(strategies.map(buildStrategy));
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}

async function deleteStrategy(req, res) {
  const { id } = req.query;
  try {
    // const { year, name } = req.body;
    // const plant = await Plant.findOne({ name: req.body.plant })._id;
    const strategy = await Strategy.findById(id);
    const tasks = await Task.find({ strategy: strategy._id });
    if (tasks[0]) throw new Error("El programa contiene tareas asignadas");
    await Strategy.findByIdAndDelete(id);
    // await Strategy.findByIdAndDelete(strategy._id);
    res.status(200).send({ success: "Programa eliminado exitosamente", id });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message, id });
  }
}

module.exports = {
  createStrategy,
  updateStrategy,
  getStrategies,
  deleteStrategy,
};
