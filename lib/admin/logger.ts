import fs from "fs";
import path from "path";

const logsFilePath = path.join(process.cwd(), "data", "logs.json");

function readLogs() {
  try {
    if (!fs.existsSync(logsFilePath)) {
      fs.mkdirSync(path.dirname(logsFilePath), { recursive: true });
      fs.writeFileSync(logsFilePath, "[]", "utf8");
      return [];
    }
    const data = fs.readFileSync(logsFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return [];
  }
}

function writeLogs(logs: any[]) {
  try {
    fs.writeFileSync(logsFilePath, JSON.stringify(logs, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing logs:", err);
  }
}

export async function logAction(action: string, user: string, details: string, ip: string = "127.0.0.1") {
  try {
    const logs = readLogs();
    const newLog = {
      id: String(Date.now()) + Math.random().toString(36).substr(2, 4),
      action,
      user,
      details,
      ip,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    };

    logs.unshift(newLog);
    const trimmed = logs.slice(0, 500);
    writeLogs(trimmed);
  } catch (err) {
    console.error("Failed to log action:", err);
  }
}
