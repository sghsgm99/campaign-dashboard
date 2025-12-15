import { db } from "../config/database";

export async function checkDatabaseConnection() {
  try {
    await db.query("SELECT 1");
    console.log("✅ MySQL connected");
  } catch (error) {
    console.error("❌ MySQL connection failed");
    console.error(error);
    process.exit(1);
  }
}
