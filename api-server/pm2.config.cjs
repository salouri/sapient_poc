/* eslint-disable @typescript-eslint/no-var-requires */
const os = require('os');

module.exports = {
  apps: [
    {
      name: 'development',
      script: 'src/server.ts',
      // autorestart: true,
      // merge_logs: true,
      watch: true, // set true for development
      ignore_watch: ['node_modules', 'test', 'logs'],
      watch_options: {
        followSymlinks: false,
      },
      max_restarts: 1,
      exec_interpreter: 'node',
      // node_args: ['ts-node'],
      instances: os.cpus().length,
    },
    {
      name: 'production',
      script: 'dist/server.js',
      autorestart: true,
      merge_logs: true,
      watch: false,
      max_restarts: 20,
      exec_interpreter: 'node',
      instances: os.cpus().length,
    },
  ],
};
