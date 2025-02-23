import cron from 'node-cron';
import { config, airportPairs } from './config';
import { AmadeusService } from './services/amadeus';
import { PriceHistoryService } from './services/priceHistory';
import { TwilioService } from './services/twilio';
import { PriceAnalyzer } from './utils/priceAnalyzer';

export class ErrorFareScheduler {
  private amadeusService: AmadeusService;
  private priceHistoryService: PriceHistoryService;
  private twilioService: TwilioService;
  private isRunning: boolean;

  constructor() {
    this.amadeusService = new AmadeusService();
    this.priceHistoryService = new PriceHistoryService();
    this.twilioService = new TwilioService();
    this.isRunning = false;
  }

  async checkErrorFares(): Promise<void> {
    if (this.isRunning) {
      console.log('Previous check still running, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('Starting error fare check...');

    try {
      for (const airportPair of airportPairs) {
        console.log(`Checking ${airportPair.origin} to ${airportPair.destination}...`);

        // Get current flight offers
        const flightOffers = await this.amadeusService.searchFlights(airportPair);
        if (flightOffers.length === 0) continue;

        // Get historical average price
        const averagePrice = await this.priceHistoryService.getSevenDayAverage(airportPair);
        if (!averagePrice) {
          // If no history exists, just store the current price
          await this.priceHistoryService.addPricePoint(airportPair, flightOffers[0].price);
          continue;
        }

        // Find the best error fare
        const errorFare = PriceAnalyzer.findBestErrorFare(
          airportPair,
          flightOffers,
          averagePrice
        );

        // Store the current lowest price
        await this.priceHistoryService.addPricePoint(airportPair, flightOffers[0].price);

        // Send notification if error fare found
        if (errorFare) {
          console.log('Error fare found!', errorFare);
          await this.twilioService.sendErrorFareAlert(errorFare);
        }
      }
    } catch (error) {
      console.error('Error during fare check:', error);
    } finally {
      this.isRunning = false;
      console.log('Error fare check completed.');
    }
  }

  start(): void {
    console.log('Starting error fare scheduler...');
    cron.schedule(config.CHECK_INTERVAL, () => {
      this.checkErrorFares();
    });
  }
} 