const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TechTaskTemplateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    subtasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubTask",
        required: true,
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Validar que existan las SubTasks
TechTaskTemplateSchema.pre("save", async function (next) {
  const SubTask = mongoose.model("SubTask");

  try {
    // 1. Traer todas las subtasks existentes
    const subTasksFromDB = await SubTask.find({
      _id: { $in: this.subtasks },
    }).lean();

    // 2. Map para lookup rápido
    const foundIds = new Set(subTasksFromDB.map((st) => st._id.toString()));

    // 3. Detectar faltantes
    const missingIds = this.subtasks.filter(
      (id) => !foundIds.has(id.toString()),
    );

    if (missingIds.length > 0) {
      // 4. (Opcional PRO) intentar reconstruir info útil
      // ⚠️ solo tenemos IDs, así que esto depende de tu flujo previo

      return next(
        new Error(`SubTasks no encontradas: ${missingIds.join(", ")}`),
      );
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("TechTaskTemplate", TechTaskTemplateSchema);
