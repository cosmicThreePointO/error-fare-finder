import twilio from 'twilio';
import { config } from '../config';
import { ErrorFare } from '../types';

export class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
  }

  async sendErrorFareAlert(errorFare: ErrorFare): Promise<void> {
    const message = this.formatErrorFareMessage(errorFare);

    try {
      await this.client.messages.create({
        body: message,
        from: config.TWILIO_FROM_NUMBER,
        to: config.TWILIO_TO_NUMBER,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
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