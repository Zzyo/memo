const CLI = require('clui');

/* eslint func-names: [0] */
module.exports = function (message) {
  let time = 0;
  const countdown = new CLI.Spinner(message, ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);

  countdown.start();

  const int = setInterval(() => {
    time += 1;
    countdown.message(`lasted ${time} seconds. `);
  }, 1000);

  this.stop = () => {
    clearInterval(int);
    countdown.stop();
  };
};
