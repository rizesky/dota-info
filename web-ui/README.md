# Web Ui

## What is this project?

This is the web ui part of the dota-info project


## Setup for Development

To set up this project for development, follow these steps:

1. **Clone the repository**
   ```
   git clone https://github.com/rizesky/dota-info.git
   cd web-ui
   ```

2. **Install dependencies**
   Make sure you have Node.js (version 22 or later) and npm installed, then run:
   ```
   npm install
   ```
   
3. **Start the development server**
   Remember to modify the DotaApiClient.js to target the intended dev server, because by default this ui and its server is in the same origin
   ```
   npm start
   ```
   This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

4. **Run tests**
   ```
   npm test
   ```
   This launches the test runner in interactive watch mode.

5. **Build for production**
   ```
   npm run build
   ```
   This builds the app for production to the `build` folder. This build folder wil be used by the golang server to server the static files


## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.


