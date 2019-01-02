module.exports = {
  apps: [{
    name: 'memo',
    script: 'server/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: true,
    error_file: 'server/logs/app-err.log',
    out_file: 'server/logs/app-out.log',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
