import { ErrorFareScheduler } from './scheduler';

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

try {
  const scheduler = new ErrorFareScheduler();
  scheduler.start();
  
  // Also run an initial check immediately
  scheduler.checkErrorFares();
  
  console.log('Error Fare Finder is running...');
} catch (error) {
  console.error('Failed to start Error Fare Finder:', error);
  process.exit(1);
} 