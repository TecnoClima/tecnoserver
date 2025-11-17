function mtbfPipeline(plantCode, from, to) {
  return [
    {
      $lookup: {
        from: "areas",
        localField: "line",
        foreignField: "lines",
        as: "areaInfo",
      },
    },
    { $unwind: "$areaInfo" },

    {
      $lookup: {
        from: "plants",
        localField: "areaInfo.plant",
        foreignField: "_id",
        as: "plantInfo",
      },
    },
    { $unwind: "$plantInfo" },

    // Filtrar por planta LO ANTES POSIBLE
    { $match: { "plantInfo.code": plantCode } },

    // Obtener WOs del dispositivo
    {
      $lookup: {
        from: "workorders",
        localField: "_id",
        foreignField: "device",
        as: "workOrders",
      },
    },

    // Obtener intervenciones
    {
      $lookup: {
        from: "interventions",
        localField: "workOrders.interventions",
        foreignField: "_id",
        as: "interventions",
      },
    },

    // Filtrar intervenciones dentro del rango
    {
      $addFields: {
        interventions: {
          $filter: {
            input: "$interventions",
            as: "i",
            cond: {
              $and: [
                { $gte: ["$$i.date", new Date(from)] },
                { $lte: ["$$i.date", new Date(to)] },
              ],
            },
          },
        },
      },
    },

    // Asegurar al menos dos intervenciones
    { $match: { "interventions.1": { $exists: true } } },

    // Ordenarlas
    {
      $addFields: {
        interventions: {
          $sortArray: { input: "$interventions", sortBy: { date: 1 } },
        },
      },
    },

    // Generar pares consecutivos
    {
      $addFields: {
        pairs: {
          $zip: {
            inputs: ["$interventions", { $slice: ["$interventions", 1] }],
          },
        },
      },
    },

    { $unwind: "$pairs" },

    // Separar prev y next correctamente
    {
      $project: {
        deviceId: "$_id",
        code: 1,
        name: 1,
        prev: { $arrayElemAt: ["$pairs", 0] },
        next: { $arrayElemAt: ["$pairs", 1] },
      },
    },

    // Buscar el WorkOrder de la intervención siguiente
    {
      $lookup: {
        from: "workorders",
        localField: "next.workOrder",
        foreignField: "_id",
        as: "nextWO",
      },
    },
    { $unwind: "$nextWO" },

    // FILTRO: debe ser clase Reclamo Y workOrder distinto
    {
      $match: {
        $expr: {
          $and: [
            { $ne: ["$prev.workOrder", "$next.workOrder"] },
            { $eq: ["$nextWO.class", "Reclamo"] },
          ],
        },
      },
    },

    // Diferencia de horas entre intervenciones
    {
      $addFields: {
        diffHours: {
          $divide: [
            { $subtract: ["$next.date", "$prev.date"] },
            1000 * 60 * 60,
          ],
        },
      },
    },

    // Agrupar por dispositivo
    {
      $group: {
        _id: "$deviceId",
        deviceCode: { $first: "$code" },
        deviceName: { $first: "$name" },
        avgDiffHours: { $avg: "$diffHours" },
        samples: { $push: "$diffHours" },
      },
    },

    { $sort: { avgDiffHours: -1 } },
  ];
}

module.exports = { mtbfPipeline };
