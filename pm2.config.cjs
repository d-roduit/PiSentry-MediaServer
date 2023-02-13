module.exports = {
  apps: [{
    name: 'PiSentry-MediaServer',
    script: './server.js',
    node_args : '-r dotenv/config', // Use environment variables declared in .env file
  }],
};
