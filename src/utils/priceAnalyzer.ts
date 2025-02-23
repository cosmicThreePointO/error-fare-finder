import { config } from '../config';
import { AirportPair, ErrorFare, FlightOffer, FlightPrice } from '../types';
import logger from './logger';

export class PriceAnalyzer {
  static isErrorFare(
    airportPair: AirportPair,
    flightOffer: FlightOffer,
    averagePrice: FlightPrice
  ): ErrorFare | null {
    // Check if there are enough seats available
    if (flightOffer.availableSeats < config.MIN_SEATS_AVAILABLE) {
      logger.info('Not enough seats available', { required: config.MIN_SEATS_AVAILABLE, available: flightOffer.availableSeats });
      return null;
    }

    // Calculate the discount percentage
    const discountPercentage = 1 - (flightOffer.price.amount / averagePrice.amount);
    
    logger.info('Price comparison', {
      route: `${airportPair.origin} to ${airportPair.destination}`,
      currentPrice: flightOffer.price.amount,
      averagePrice: averagePrice.amount,
      discountPercentage,
      threshold: config.PRICE_THRESHOLD
    });

    // Check if the discount meets our threshold
    if (discountPercentage < config.PRICE_THRESHOLD) {
      logger.info('Discount does not meet threshold', { discountPercentage, threshold: config.PRICE_THRESHOLD });
      return null;
    }

    // Return the error fare details
    return {
      airportPair,
      currentPrice: flightOffer.price,
      averagePrice,
      discountPercentage,
      availableSeats: flightOffer.availableSeats,
      departureDate: flightOffer.departureDate,
      returnDate: flightOffer.returnDate,
    };
  }

  static findBestErrorFare(
    airportPair: AirportPair,
    flightOffers: FlightOffer[],
    averagePrice: FlightPrice
  ): ErrorFare | null {
    const errorFares = flightOffers
      .map(offer => this.isErrorFare(airportPair, offer, averagePrice))
      .filter((fare): fare is ErrorFare => fare !== null);

    if (errorFares.length === 0) {
      return null;
    }

    // Return the fare with the highest discount
    return errorFares.reduce((best, current) => 
      current.discountPercentage > best.discountPercentage ? current : best
    );
  }
} 