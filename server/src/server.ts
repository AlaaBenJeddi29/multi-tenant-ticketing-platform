
import "dotenv/config";

import app from "./app.js";
import { startAutomationJobs } from "./modules/automation/jobs/automation.jobs.js";

const PORT = process.env.PORT || 5000;

startAutomationJobs();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
