module.exports = {
  apps: [
    {
      name: "Real-Estate-Backend",
      script: "npm",
      args: "run dev",
      cwd: "/root/real-estate",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
