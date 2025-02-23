import { ErrorFareScheduler } from './scheduler';
import logger from './utils/logger';

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM signal. Starting graceful shutdown...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT signal. Starting graceful shutdown...');
  process.exit(0);
});

try {
  logger.info('Starting Error Fare Finder...');
  
  const scheduler = new ErrorFareScheduler();
  scheduler.start();
  
  // Also run an initial check immediately
  scheduler.checkErrorFares().catch(error => {
    logger.error('Error during initial check:', { error });
  });
  
  logger.info('Error Fare Finder is running...');
} catch (error) {
  logger.error('Failed to start Error Fare Finder:', { error });
  process.exit(1);
} 