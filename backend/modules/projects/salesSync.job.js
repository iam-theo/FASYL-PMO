import cron from "node-cron";
import { syncSalesProjects } from "./salesSync.service.js";

export const startSalesSync = () => {
    // runs every 5 minutes
    cron.schedule("*/1 * * * *", async () => {
        console.log("Running Sales → PMO sync...");

        try {
            const result = await syncSalesProjects();

            console.log("Sync successful:", result.count);
        } catch (err) {
            console.error("Sync failed:", err.message);
        }
    });
};