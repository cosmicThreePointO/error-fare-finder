# Error Fare Finder

A simple Node.js application that monitors flight prices and alerts you when it finds error fares (unusually low prices) for specific routes.

## Features

- Monitors specified airport pairs for flight prices
- Detects error fares (80% below 7-day average price)
- Checks for minimum seat availability
- Sends SMS notifications via Twilio
- Runs hourly checks
- Stores price history locally
- Production-ready logging
- Docker support

## Prerequisites

- Node.js (v14 or higher) OR Docker
- npm (v6 or higher)
- Amadeus API credentials
- Twilio account and credentials

## Local Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd error-fare-finder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with your API credentials:
   ```bash
   AMADEUS_CLIENT_ID=your_amadeus_client_id
   AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_FROM_NUMBER=your_twilio_phone_number
   TWILIO_TO_NUMBER=your_phone_number
   ```

5. Configure your airport pairs in `src/config.ts`.

## Docker Deployment

1. Make sure you have Docker and Docker Compose installed

2. Build and start the container:
   ```bash
   docker-compose up -d
   ```

3. View logs:
   ```bash
   docker-compose logs -f
   ```

4. Stop the container:
   ```bash
   docker-compose down
   ```

## Remote Deployment Options

1. **DigitalOcean Droplet**:
   - Create a new droplet
   - Install Docker and Docker Compose
   - Clone the repository
   - Copy your .env file
   - Run with docker-compose

2. **AWS EC2**:
   - Launch an EC2 instance
   - Install Docker and Docker Compose
   - Clone the repository
   - Copy your .env file
   - Run with docker-compose

3. **Heroku**:
   - Install Heroku CLI
   - Create a new Heroku app
   - Set environment variables in Heroku dashboard
   - Deploy using Heroku container registry

## Configuration

You can configure the following parameters in the `.env` file:

- `CHECK_INTERVAL`: Cron expression for check frequency (default: every hour)
- `PRICE_THRESHOLD`: Price threshold for error fares (default: 0.8 = 80% below average)
- `MIN_SEATS_AVAILABLE`: Minimum number of seats required (default: 2)

## Development

For development with auto-reload:
```bash
npm run dev
```

## Logs

Logs are stored in the `logs` directory:
- `logs/error.log`: Error-level logs
- `logs/combined.log`: All logs

In development, logs are also output to the console.

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 