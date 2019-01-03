const { exec } = require('child_process');

const postRestart = async () => {
  const restart = exec('npm run restart');
  restart.stdout.on('data', (stats) => {
    process.stdout.write(`${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}\n`);
  });
  return true;
};

module.exports = {
  postRestart,
};
