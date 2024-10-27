const path = require('path');

module.exports = {
    webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname); // This sets up @ as an alias for the root directory
    return config;
  },
};