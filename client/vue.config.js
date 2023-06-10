// const path = require('path');
// const fs = require('fs');
module.exports = {
    devServer: {
      open: process.platform === 'darwin',
      host: '0.0.0.0',
      port: 4000, // CHANGE YOUR PORT HERE!
      https: true,
      hotOnly: false,
    },
  }
// module.exports = {
//   devServer: {
//     https: {
//       key: fs.readFileSync(path.resolve(__dirname, 'keys', 'private.key')),
//       cert: fs.readFileSync(path.resolve(__dirname, 'keys', 'certificate.crt'))
//     },
//     public: 'https://localhost:443/'
//   }
// };
