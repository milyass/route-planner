const express = require("express");
const plansRouter = new express.Router();
const { formatResultPlan, requestPlanFromOpenTripPlanner } = require("./utils");


plansRouter.get("/route-plan", async (req, res, next) => {
  try {
    const response = await  requestPlanFromOpenTripPlanner(req.query)
    const { plan } = response.data;
    return res.status(200).json({ plan: formatResultPlan(plan) });
  } catch (error) {
    return res.status(400).json({
      status: "failure",
      error: error.message,
    });
  }
});

module.exports = plansRouter;
