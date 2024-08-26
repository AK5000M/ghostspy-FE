module.exports = {
  apps: [
    {
      name: "frontend", // Name of the application
      script: "node_modules/next/dist/bin/next", // Path to Next.js CLI
      args: "start", // Argument to start the Next.js application
      instances: "1", // Number of instances to be started
      exec_mode: "cluster", // Enables cluster mode for load balancing
      watch: false, // Set to false in production for stability
      max_memory_restart: "4G", // Restart the application if it exceeds 1GB memory
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],

  // deploy: {
  //   production: {
  //     user: 'node', // SSH user
  //     host: 'your-server.com', // SSH host
  //     ref: 'origin/main', // Branch to pull from
  //     repo: 'git@github.com:username/nextjs-app.git', // Git repository
  //     path: '/var/www/nextjs-app', // Server path
  //     'post-deploy':
  //       'npm install && npm run build && pm2 reload ecosystem.config.js --env production', // Commands to run after deploy
  //   },
  // },
};
