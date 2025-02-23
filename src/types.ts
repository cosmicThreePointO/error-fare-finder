export interface AirportPair {
  origin: string;
  destination: string;
}

export interface FlightPrice {
  amount: number;
  currency: string;
}

export interface FlightOffer {
  price: FlightPrice;
  availableSeats: number;
  departureDate: string;
  returnDate: string;
}

export interface PriceHistory {
  date: string;
  price: FlightPrice;
}

export interface PriceHistoryRecord {
  airportPair: AirportPair;
  history: PriceHistory[];
}

export interface ErrorFare {
  airportPair: AirportPair;
  currentPrice: FlightPrice;
  averagePrice: FlightPrice;
  discountPercentage: number;
  availableSeats: number;
  departureDate: string;
  returnDate: string;
} 