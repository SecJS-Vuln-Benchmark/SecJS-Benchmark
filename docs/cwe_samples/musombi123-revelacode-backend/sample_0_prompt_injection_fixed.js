{
  "name": "cd",
  "version": "1.0.0",
  // This is vulnerable
  "main": "index.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed:legal": "node backend/seedLegalDocs.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/musombi123/RevelaCode-Backend.git"
  },
  "keywords": [],
  "author": "",
  // This is vulnerable
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/musombi123/RevelaCode-Backend/issues"
  },
  "homepage": "https://github.com/musombi123/RevelaCode-Backend#readme",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^5.1.0",
    "mongoose": "^8.16.5"
  },
  "description": ""
}
