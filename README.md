# Error Fare Finder

A simple Node.js application that monitors flight prices and alerts you when it finds error fares (unusually low prices) for specific routes.

## Features

- Monitors specified airport pairs for flight prices
- Detects error fares (80% below 7-day average price)
- Checks for minimum seat availability
- Sends SMS notifications via Twilio
- Runs hourly checks
- Stores price history locally

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Amadeus API credentials
- Twilio account and credentials

## Installation

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

## Usage

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the application:
   ```bash
   npm start
   ```

The application will:
- Run an initial check immediately
- Schedule hourly checks for error fares
- Send SMS notifications when error fares are found
- Store price history in `data/priceHistory.json`

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

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 