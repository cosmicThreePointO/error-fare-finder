import cron from 'node-cron';
import { config, airportPairs } from './config';
import { AmadeusService } from './services/amadeus';
import { PriceHistoryService } from './services/priceHistory';
import { TwilioService } from './services/twilio';
import { PriceAnalyzer } from './utils/priceAnalyzer';
import logger from './utils/logger';

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
      logger.info('Previous check still running, skipping...');
      return;
    }

    this.isRunning = true;
    logger.info('Starting error fare check...');

    try {
      for (const airportPair of airportPairs) {
        logger.info(`Checking ${airportPair.origin} to ${airportPair.destination}...`);

        // Get current flight offers
        const flightOffers = await this.amadeusService.searchFlights(airportPair);
        if (flightOffers.length === 0) {
          logger.warn(`No flight offers found for ${airportPair.origin} to ${airportPair.destination}`);
          continue;
        }

        // Get historical average price
        const averagePrice = await this.priceHistoryService.getSevenDayAverage(airportPair);
        if (!averagePrice) {
          logger.info(`No price history for ${airportPair.origin} to ${airportPair.destination}, storing first data point`);
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
          logger.info('Error fare found!', { errorFare });
          await this.twilioService.sendErrorFareAlert(errorFare);
        }
      }
    } catch (error) {
      logger.error('Error during fare check:', { error });
    } finally {
      this.isRunning = false;
      logger.info('Error fare check completed.');
    }
  }

  start(): void {
    logger.info('Starting error fare scheduler...');
    cron.schedule(config.CHECK_INTERVAL, () => {
      this.checkErrorFares().catch(error => {
        logger.error('Unhandled error in checkErrorFares:', { error });
      });
    });
  }
} 