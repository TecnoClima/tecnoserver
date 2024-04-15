const UserOptions = require("../models/UserOptions");
const DeviceOptions = require("../models/DeviceOptions");
const WOOptions = require("../models/WOoptions");
const User = require("../models/User");
const Device = require("../models/Device");
const WorkOrder = require("../models/WorkOrder");

const excludedPaths = ["name", "_id", "updatedAt", "createdAt", "__v", "units"];

function getCount(array, options) {
  const fixedKeys = {
    types: "type",
    issueType: "initIssue",
    causes: "cause",
    classes: "class",
  };
  const newObject = {};
  Object.keys(options.schema.paths)
    .filter((p) => !excludedPaths.includes(p))
    .forEach((option) => {
      const values = options[option];
      newObject[option] = values.map((value) => {
        const valueName = value.name || value;
        let data = {
          value: valueName,
          count: array.filter(
            (e) => e[fixedKeys[option] || option] === valueName
          ).length,
        };
        if (value.name) {
          Object.keys(value.schema.paths)
            .filter((p) => !excludedPaths.includes(p))
            .forEach((key) => (data[key] = value[key]));
        }
        return data;
      });
    });
  return newObject;
}

async function getOptionSet(model) {
  return await model.find({}, "-_id -name -createdAt -updatedAt -__v -units");
}

async function getOptions(req, res) {
  try {
    const [
      [userOptions],
      [deviceOptions],
      [wOOptions],
      users,
      devices,
      workorders,
    ] = await Promise.all([
      getOptionSet(UserOptions),
      getOptionSet(DeviceOptions),
      getOptionSet(WOOptions),
      User.find({}),
      Device.find({}),
      WorkOrder.find({}),
    ]);

    getCount(workorders, wOOptions);

    res.send({
      userOptions: getCount(users, userOptions),
      deviceOptions: getCount(devices, deviceOptions),
      wOOptions: getCount(workorders, wOOptions),
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

async function deleteOption(req, res) {
  const { model, option, value } = req.query;
  try {
    const models = {
      userOptions: { options: UserOptions, element: User },
      deviceOptions: { options: DeviceOptions, element: Device },
      wOOptions: { options: WOOptions, element: WorkOrder },
    };
    const OptionSet = models[model]?.options;
    const ElementSet = models[model]?.element;
    if (!OptionSet || !ElementSet) throw new Error("Model Not Found");
    const [options] = await getOptionSet(OptionSet);
    const usages = getCount(await ElementSet.find({}), options)[option];
    const count = usages.find((e) => e.value === value).count;
    if (count === 0) {
      const documentoActualizado = await OptionSet.findOneAndUpdate(
        { [option]: { $in: [value] } },
        { $pull: { [option]: value } },
        { new: true }
      );
      console.log(model, option, documentoActualizado[option]);

      res
        .status(200)
        .send({ model, option, values: documentoActualizado[option] });
    } else {
      res.status(400).send({ error: "Opción en uso" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}

module.exports = {
  getOptions,
  deleteOption,
};
