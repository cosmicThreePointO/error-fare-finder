import fs from 'fs/promises';
import path from 'path';
import { format, subDays } from 'date-fns';
import { AirportPair, FlightPrice, PriceHistory, PriceHistoryRecord } from '../types';

export class PriceHistoryService {
  private readonly filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'priceHistory.json');
  }

  async loadHistory(): Promise<PriceHistoryRecord[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveHistory(records: PriceHistoryRecord[]): Promise<void> {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(records, null, 2));
  }

  async addPricePoint(airportPair: AirportPair, price: FlightPrice): Promise<void> {
    const records = await this.loadHistory();
    const today = format(new Date(), 'yyyy-MM-dd');

    const existingRecord = records.find(
      (r) => r.airportPair.origin === airportPair.origin && 
             r.airportPair.destination === airportPair.destination
    );

    if (existingRecord) {
      existingRecord.history.push({ date: today, price });
    } else {
      records.push({
        airportPair,
        history: [{ date: today, price }],
      });
    }

    await this.saveHistory(records);
  }

  async getSevenDayAverage(airportPair: AirportPair): Promise<FlightPrice | null> {
    const records = await this.loadHistory();
    const record = records.find(
      (r) => r.airportPair.origin === airportPair.origin && 
             r.airportPair.destination === airportPair.destination
    );

    if (!record) return null;

    const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const recentPrices = record.history
      .filter((h) => h.date >= sevenDaysAgo)
      .map((h) => h.price.amount);

    if (recentPrices.length === 0) return null;

    const averageAmount = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    return {
      amount: averageAmount,
      currency: record.history[0].price.currency,
    };
  }
} 