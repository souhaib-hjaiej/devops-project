import { Kafka } from 'kafkajs';
import db from '../config/db.js';
const kafka = new Kafka({
  clientId: 'salles-service',
  brokers: ['kafka:9092'], // Ensure this is correct for your Kafka broker
});

const consumer = kafka.consumer({ groupId: 'salles-group' });
const startConsumer = async () => {
  console.log('Connecting to Kafka...');
  await consumer.connect();
  console.log('Connected to Kafka.');

  // Use admin client to list topics
  const admin = kafka.admin();
  await admin.connect();
  const topics = await admin.listTopics();
  console.log('Available Topics:', topics);
  await admin.disconnect();

  await consumer.subscribe({ topic: 'reservation_created', fromBeginning: true });

  console.log('Subscribed to topic: reservation_created.');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`✅ Message received on topic ${topic}: ${message.value.toString()}`);
      const reservation = JSON.parse(message.value.toString());
      console.log('Reservation:', reservation);
      try {
        const { salle_id } = reservation;
  
        const query = 'UPDATE salles SET etat = ? WHERE id = ?';
        await db.execute(query, ['occupied', salle_id]);
  
        console.log(`✅ Updated salle ${salle_id} to 'occupied'`);
      } catch (err) {
        console.error('❌ Error updating salle etat:', err);
      }
    }
  });
};


export { startConsumer };
