# Build the Go API
FROM golang:1.22-alpine AS go-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o dota-leaderboard ./cmd/server

# Build the React frontend
FROM node:22-alpine AS react-builder
WORKDIR /app
COPY web-ui/package.json web-ui/package-lock.json ./
RUN npm install
COPY web-ui ./
RUN npm run build

# Final stage
FROM alpine:edge
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=go-builder /app/dota-leaderboard .
COPY --from=react-builder /app/build ./web-ui/build
RUN chmod +x ./dota-leaderboard
EXPOSE 8080
ENTRYPOINT ["/app/dota-leaderboard"]