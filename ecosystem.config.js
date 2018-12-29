module.exports = {
  apps: [{
    name: 'memo',
    script: 'server/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: true,
    ignore_watch: [
      'build',
      'client',
      'node_modules',
      'public',
      '.eslintrc.json',
      'postcss.config.js',
      'tsconfig.json',
      'tslint.json',
    ],
    error_file: 'server/logs/app-err.log',
    out_file: 'server/logs/app-out.log',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
