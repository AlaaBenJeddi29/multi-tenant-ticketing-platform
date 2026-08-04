import cron from "node-cron";

import { processSlaAutomation } from "../services/automation-runtime.service.js";

export function startAutomationJobs() {
  /**
   * Every minute.
   */

  cron.schedule("* * * * *", async () => {
    try {
      const result =
        await processSlaAutomation();

      console.log(
        "[Automation] SLA check completed",
        result
      );
    } catch (error) {
      console.error(
        "[Automation] SLA check failed",
        error
      );
    }
  });

  console.log(
    "[Automation] Scheduler started."
  );
}