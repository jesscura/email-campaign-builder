const { Queue, Worker } = require('bullmq')
const Redis = require('ioredis')

const connection = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379')

const emailQueue = new Queue('email', { connection })

new Worker('email', async (job) => {
  // TODO: send email via providers
  console.log('Processing email job', job.id, job.data)
}, { connection })

console.log('Workers started')
