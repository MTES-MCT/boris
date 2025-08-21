const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

async function run() {
  try {
    console.log("Building frontend...");
    await execAsync("npm run build -w @boris/frontend");

    console.log("Starting server...");
    const serverProcess = exec("npm run preview -w @boris/frontend");

    // Wait a bit for server to start
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Running lighthouse desktop...");
    await execAsync("npm run lighthouse-desktop -w @boris/frontend");

    console.log("Lighthouse tests completed successfully");
  } catch (error) {
    console.error("Error running lighthouse tests:", error);
    process.exit(1);
  }
}

run();
