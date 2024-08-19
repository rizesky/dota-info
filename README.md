# Dota 2 Leaderboard Application

This app is for getting dota information from several source.
For now it is only able to get 10 top mmr leaders on each region.
This project consists of a Go backend API and a React frontend for displaying Dota 2 leaderboard data, served from a single Go server.

## Project Structure

- `cmd/server/`: Contains the main Go application for web server
- `internal/`: Internal packages for the Go backend
- `web-ui/`: Contains the React frontend application. For more detail check the directory readme

## Development

### Backend

1. Run `go run cmd/server/main.go`

### Frontend

1. Navigate to the `web-ui/` directory
2. Run `npm install` to install dependencies
3. Run `npm start` for development
4. Run `npm run build` to build for production

## Production Build

1. Build the Docker image: `docker build -t dota2-leaderboard .`
2. Run the container: `docker run -p 8080:8080 dota2-leaderboard`

The application will be available at `http://localhost:8080`

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments
- Valve Corporation for Dota 2
- [Dota 2 Leaderboard](https://www.dota2.com/leaderboard)