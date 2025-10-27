import { config } from 'dotenv';
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { campaignProcessor } from './processors/campaign.processor';
import { analyticsProcessor } from './processors/analytics.processor';
import { predictionProcessor } from './processors/prediction.processor';

// Load environment variables
config({ path: ['.env.local', '.env'] });

// Redis connection
const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// Create queues
export const campaignQueue = new Queue('campaigns', { connection });
export const analyticsQueue = new Queue('analytics', { connection });
export const predictionQueue = new Queue('predictions', { connection });

// Create workers
const campaignWorker = new Worker('campaigns', campaignProcessor, { connection });
const analyticsWorker = new Worker('analytics', analyticsProcessor, { connection });
const predictionWorker = new Worker('predictions', predictionProcessor, { connection });

// Event handlers
campaignWorker.on('completed', (job) => {
  console.log(`✅ Campaign job ${job.id} completed`);
});

campaignWorker.on('failed', (job, err) => {
  console.error(`❌ Campaign job ${job?.id} failed:`, err);
});

analyticsWorker.on('completed', (job) => {
  console.log(`✅ Analytics job ${job.id} completed`);
});

analyticsWorker.on('failed', (job, err) => {
  console.error(`❌ Analytics job ${job?.id} failed:`, err);
});

predictionWorker.on('completed', (job) => {
  console.log(`✅ Prediction job ${job.id} completed`);
});

predictionWorker.on('failed', (job, err) => {
  console.error(`❌ Prediction job ${job?.id} failed:`, err);
});

console.log('🚀 Workers started successfully');
console.log('📊 Listening for jobs on:');
console.log('  - campaigns queue');
console.log('  - analytics queue');
console.log('  - predictions queue');

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down workers...');
  await campaignWorker.close();
  await analyticsWorker.close();
  await predictionWorker.close();
  await connection.quit();
  process.exit(0);
});
