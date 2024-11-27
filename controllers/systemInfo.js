const os = require("os");
const { exec } = require("child_process");


//get sysytem information.............................
const getSystemInfo = async (req, res) => {
  try {
    const systemInfo = {
      hostname: os.hostname(),
      platform: os.platform(),
      architecture: os.arch(),
      cpu: os.cpus(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
      },
      uptime: os.uptime(),
      networkInterfaces: os.networkInterfaces(),
      loadAverage: os.loadavg(),
    };

    return res.status(200).json({
      success: true,
      message: "Fetched system information successfully",
      data: systemInfo,
    });
  } catch (error) {
    // Log the full error for debugging
    console.error("Error fetching system information:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve system information",
      error: error.message, // Include the error message in the response
    });
  }
};

// GET endpoint to fetch installed applications..........................

const getInstalledAppsLinux = async () => {
  return new Promise((resolve, reject) => {
    exec("dpkg -l", (error, stdout, stderr) => {
      //dpkg(Debian Package Manager) used to Linux system  and exec (likely from the child_process module) to run the command dpkg --get-selections, which lists all installed packages
      if (error) {
        return reject(
          `Error fetching installed apps: ${stderr || error.message}`
        );
      }
      const apps = stdout
        .split("\n")
        .filter((line) => line.startsWith("ii")) // Only include installed packages
        .map((line) => {
          const parts = line.split(/\s+/); // Split by whitespace
          const name = parts[1]; // Package name is the second column
          const version = parts[2]; // Version is the third column

          return { name, version };
        });
      resolve(apps);
    });
  });
};

// Example usage in your API endpoint
const systemInstalledApps = async (req, res) => {
  try {
    const installedApps = await getInstalledAppsLinux(); // Use the Linux function here
    console.log(installedApps);

    return res.status(200).json({
      success: true,
      message: "Fetched installed applications successfully",
      data: installedApps,
    });
  } catch (error) {
    console.error("Error fetching installed applications:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve installed applications",
      error: error.message,
    });
  }
};

//get globaly installed packages .................................
const globalInstallPackages = async (req, res) => {
  try {
    exec("npm ls -g --depth=0 --json", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error fetching global packages: ${error.message}`);
        return res
          .status(500)
          .json({ error: "Failed to fetch global packages" });
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).json({ error: stderr });
      }

      // Parse the JSON output from the command
      const globalPackages = JSON.parse(stdout).dependencies || {};
      res.json(globalPackages);
    });
  } catch (error) {
    console.error("Error fetching installed applications:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve installed applications",
      error: error.message,
    });
  }
};

// Get Open Ports and Listening Services
async function getOpenPorts() {
    try {
        const openPorts = await runCommand('ss -tuln');
        console.log('Open Ports and Listening Services:');
        console.log(openPorts);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getSystemInfo, systemInstalledApps, globalInstallPackages,getOpenPorts };
