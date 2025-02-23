import { z } from 'zod';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
const result = dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

if (result.error) {
  throw new Error('Failed to load .env file');
}

const envSchema = z.object({
  // Amadeus Configuration
  AMADEUS_CLIENT_ID: z.string().min(1, 'Amadeus Client ID is required'),
  AMADEUS_CLIENT_SECRET: z.string().min(1, 'Amadeus Client Secret is required'),

  // Twilio Configuration
  TWILIO_ACCOUNT_SID: z.string().startsWith('AC', 'Invalid Twilio Account SID format'),
  TWILIO_AUTH_TOKEN: z.string().min(32, 'Invalid Twilio Auth Token format'),
  TWILIO_FROM_NUMBER: z.string().startsWith('+', 'Phone number must start with +'),
  TWILIO_TO_NUMBER: z.string().startsWith('+', 'Phone number must start with +'),

  // Application Configuration
  CHECK_INTERVAL: z.string().default('0 * * * *').refine(
    (value: string) => {
      try {
        // Basic cron validation
        const parts = value.split(' ');
        return parts.length === 5;
      } catch {
        return false;
      }
    },
    'Invalid cron expression'
  ),
  PRICE_THRESHOLD: z.coerce
    .number()
    .min(0, 'Price threshold must be positive')
    .max(1, 'Price threshold must be less than or equal to 1')
    .default(0.8),
  MIN_SEATS_AVAILABLE: z.coerce
    .number()
    .int('Must be an integer')
    .min(1, 'Minimum seats must be at least 1')
    .default(2),
});

type Config = z.infer<typeof envSchema>;
let config: Config;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`- ${err.path.join('.')}: ${err.message}`);
    });
  }
  throw new Error('Failed to validate environment variables');
}

export { config };

// Airport pairs to monitor
export const airportPairs = [
  { origin: 'JFK', destination: 'LHR' }, // New York to London
  { origin: 'LAX', destination: 'CDG' }, // Los Angeles to Paris
] as const; 