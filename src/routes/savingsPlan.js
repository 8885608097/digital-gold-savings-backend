const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createPlan,
  getMyPlans,
  pausePlan,
  resumePlan,
} = require("../controllers/savingsPlanController");

router.post("/create", auth, createPlan);
router.get("/", auth, getMyPlans);
router.post("/:planId/pause", auth, pausePlan);
router.post("/:planId/resume", auth, resumePlan);

module.exports = router;
