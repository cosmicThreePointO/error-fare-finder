import twilio from 'twilio';
import { config } from '../config';
import { ErrorFare } from '../types';
import logger from '../utils/logger';

export class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
  }

  async sendErrorFareAlert(errorFare: ErrorFare): Promise<void> {
    const message = this.formatErrorFareMessage(errorFare);

    try {
      logger.info('Attempting to send SMS alert...', {
        to: config.TWILIO_TO_NUMBER,
        from: config.TWILIO_FROM_NUMBER
      });

      const response = await this.client.messages.create({
        body: message,
        from: config.TWILIO_FROM_NUMBER,
        to: config.TWILIO_TO_NUMBER,
      });

      logger.info('SMS alert sent successfully', {
        messageId: response.sid,
        status: response.status
      });
    } catch (error) {
      if (error instanceof Error) {
        // Handle trial account specific errors
        if (error.message.includes('not a valid message-capable Twilio phone number')) {
          logger.error('Trial account limitation: Please verify your recipient number in Twilio console and use a message-capable number', {
            error: error.message,
            helpLink: 'https://www.twilio.com/docs/usage/tutorials/how-to-use-your-free-trial-account'
          });
        } else {
          logger.error('Error sending SMS:', {
            error: error.message,
            code: (error as any).code,
            status: (error as any).status
          });
        }
      } else {
        logger.error('Unknown error sending SMS:', { error });
      }
    }
  }

  private formatErrorFareMessage(errorFare: ErrorFare): string {
    return `
🚨 Error Fare Alert! 🚨

Route: ${errorFare.airportPair.origin} ✈️ ${errorFare.airportPair.destination}
Current Price: ${errorFare.currentPrice.amount} ${errorFare.currentPrice.currency}
Average Price: ${errorFare.averagePrice.amount} ${errorFare.averagePrice.currency}
Discount: ${Math.round(errorFare.discountPercentage * 100)}%
Available Seats: ${errorFare.availableSeats}
Departure: ${new Date(errorFare.departureDate).toLocaleDateString()}
Return: ${new Date(errorFare.returnDate).toLocaleDateString()}

Book now before it's gone! 🎉
    `.trim();
  }
} 