# Dota 2 MMR Leaderboard

## What is this project?

This project is a web application that displays top 10 leaderboard for Dota 2 players across  regions.


## Setup for Development

To set up this project for development, follow these steps:

1. **Clone the repository**
   ```
   git clone https://github.com/rizesky/dota-info.git
   cd dota-info
   ```

2. **Install dependencies**
   Make sure you have Node.js (version 22 or later) and npm installed, then run:
   ```
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add any necessary environment variables. For example:
   ```
   REACT_APP_BE_DOTA_INFO_HOST=https://api.example.com
   ```

4. **Start the development server**
   ```
   npm start
   ```
   This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

5. **Run tests**
   ```
   npm test
   ```
   This launches the test runner in interactive watch mode.

6. **Build for production**
   ```
   npm run build
   ```
   This builds the app for production to the `build` folder.

## Deployment
For production, this app is served by an nginx server, see Dockerfile for more detail
1. App is served under an nginx server, see `Dockerfile`
2. Deployed to fly.io, see `fly.toml`
3. For now, only me can deploy this app


## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments
- Valve Corporation for Dota 2
- Dota 2 Leaderboard `https://www.dota2.com/leaderboard`
