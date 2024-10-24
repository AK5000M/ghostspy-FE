/**
 * Define the Shared functions that use in platform
 */

// Generate Random Numbers
export const generateRandomNumber = () => {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return randomNum;
};

// Generate Random String(xxxx.xxxx.xxxx)
export const generateRandomPackage = () => {
  const meanings = [
    "feature",
    "bugfix",
    "update",
    "patch",
    "enhancement",
    "hotfix",
    "release",
    "improvement",
    "build",
    "revision",
    "version",
    "alpha",
    "beta",
    "gamma",
    "delta",
    "epsilon",
    "stable",
    "testing",
    "maintenance",
    "compatibility",
    "optimization",
    "security",
    "refactoring",
    "documentation",
    "integration",
    "deployment",
    "automation",
    "performance",
    "scalability",
    "usability",
    "reliability",
    "error handling",
    "backup",
    "rollback",
    "snapshot",
    "monitoring",
    "logging",
    "auditing",
    "authentication",
    "authorization",
    "encryption",
    "decryption",
    "validation",
    "verification",
    "workload",
    "workflow",
    "working",
    "worked",
    "workrance",
    "workread",
    "workgfrdf",
    "workeeds",
  ];

  let randomPackage = "";

  for (let i = 0; i < 12; i++) {
    const segmentLength = Math.floor(Math.random() * 2) + 1;
    const meaningIndex = Math.floor(Math.random() * meanings.length);
    const segment = meanings[meaningIndex].slice(0, segmentLength);
    randomPackage += segment;
    if ((i + 1) % 4 === 0 && i !== 11) {
      randomPackage += ".";
    }
  }

  return randomPackage;
};

// Foramt DateTime
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Format DateTime to DD/MM/YYYY
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Use UTC methods to avoid time zone issues
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};
