// kafka/producer.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'salles-service',
  brokers: ['kafka:9092'], // Ensure this is correct for your Kafka broker
});

const producer = kafka.producer();

// Connect Kafka producer to Kafka broker
export const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('✅ Kafka producer connected');
  } catch (error) {
    console.error('❌ Failed to connect Kafka producer:', error);
    process.exit(1);
  }
};

// Send a message to Kafka
export const sendMessage = async (message) => {
  try {
    await producer.send({
      topic: 'reservation_created',
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log('✅ Message sent to Kafka');
  } catch (error) {
    console.error('❌ Error sending message to Kafka:', error);
  }
};

// Disconnect the Kafka producer
export const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    console.log('✅ Kafka producer disconnected');
  } catch (error) {
    console.error('❌ Failed to disconnect Kafka producer:', error);
  }
};
