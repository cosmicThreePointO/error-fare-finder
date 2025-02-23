import Amadeus from 'amadeus';
import { addDays, format } from 'date-fns';
import { config } from '../config';
import { AirportPair, FlightOffer } from '../types';

export class AmadeusService {
  private client: Amadeus;

  constructor() {
    this.client = new Amadeus({
      clientId: config.AMADEUS_CLIENT_ID,
      clientSecret: config.AMADEUS_CLIENT_SECRET,
    });
  }

  async searchFlights(airportPair: AirportPair): Promise<FlightOffer[]> {
    // For testing: Return mock data that will trigger our alert
    const basePrice = airportPair.destination === 'LHR' ? 980 : 1176; // 2% lower than historical prices
    const today = new Date();
    
    return [{
      price: {
        amount: basePrice,
        currency: 'USD'
      },
      availableSeats: 4,
      departureDate: format(addDays(today, 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      returnDate: format(addDays(today, 8), 'yyyy-MM-dd\'T\'HH:mm:ss')
    }];

    // Comment out the actual API call for now
    /*try {
      const today = new Date();
      const departureDate = format(today, 'yyyy-MM-dd');
      const returnDate = format(addDays(today, 7), 'yyyy-MM-dd');

      const response = await this.client.shopping.flightOffersSearch.get({
        originLocationCode: airportPair.origin,
        destinationLocationCode: airportPair.destination,
        departureDate,
        returnDate,
        adults: 1,
        max: 5,
      });

      return response.data.map((offer: any) => ({
        price: {
          amount: parseFloat(offer.price.total),
          currency: offer.price.currency,
        },
        availableSeats: offer.numberOfBookableSeats,
        departureDate: offer.itineraries[0].segments[0].departure.at,
        returnDate: offer.itineraries[1].segments[0].departure.at,
      }));
    } catch (error) {
      console.error('Error searching flights:', error);
      return [];
    }*/
  }
} 