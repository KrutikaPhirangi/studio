import { Kafka, KafkaConfig } from 'kafkajs';

/**
 * Represents the connection status to a Kafka broker.
 */
export interface KafkaConnectionStatus {
  /**
   * Indicates whether the connection to the Kafka broker is established.
   */
  isConnected: boolean;
}

/**
 * Represents a Kafka topic.
 */
export interface KafkaTopic {
  /**
   * The name of the Kafka topic.
   */
  name: string;
}

/**
 * Represents a Kafka message.
 */
export interface KafkaMessage {
  /**
   * The content of the Kafka message. Can be string or JSON object.
   */
  content: string | Record<string, any>;
}

// Global variable to hold the Kafka client instance
let kafkaClient: Kafka | null = null;

// Function to connect to Kafka
export async function connectToKafka(brokers: string[], config?: KafkaConfig): Promise<Kafka> {
  if(kafkaClient)
  {
    return kafkaClient;
  }

  try {
    if (!brokers || brokers.length === 0) {
      throw new Error("No Kafka brokers provided.");
    }

    kafkaClient = new Kafka({
        clientId: 'my-app',
        brokers: brokers, // Your broker addresses
        ...config,
    });
   // Check if it got connected
   await kafkaClient.producer().connect();
   await kafkaClient.admin().connect();
   console.log('Kafka connected successfully!');

    return kafkaClient;
  } catch (error) {
    console.error("Error connecting to Kafka:", error);
    kafkaClient = null; // Reset on error
    throw error; // Re-throw to be handled by the caller
  }
}

// Function to get Kafka connection status
export async function getKafkaConnectionStatus(): Promise<KafkaConnectionStatus> {
    if (kafkaClient) {
      return { isConnected: true };
    } else {
       throw new Error("Not Connected to Kafka cluster");
    }
}

// Function to get Kafka topics
export async function getKafkaTopics(env: string): Promise<KafkaTopic[]> {
  if (!kafkaClient) {
    throw new Error(`Not connected to Kafka, cant get topics for : ${env}`);
  }

  try {
    const admin = kafkaClient.admin();
    const topics = await admin.listTopics();

    // Check if any topics were found
    if (topics.length === 0) {
      throw new Error("No topics found in the Kafka cluster.");
    }

    return topics.map(topic => ({ name: `${env}.${topic}` }));
  } catch (error) {
    console.error(`Error getting Kafka topics for ${env}:`, error);
    throw error;
  }
}
// Function to get Kafka messages
// Function to get Kafka messages (using kafkajs)

async function getKafkaMessages(topic: string, count: number): Promise<KafkaMessage[]> {
    if (!kafkaClient) {
        throw new Error(`Not connected to Kafka, cant get messages for : ${topic}`);
      }
      const consumer = kafkaClient.consumer({ groupId: 'my-group' });
      await consumer.connect();
      await consumer.subscribe({ topic: topic, fromBeginning: true });
      let messages:KafkaMessage[] = []
        await consumer.run({
            eachMessage: async ({ message }) => {
                // Process each message
                if(messages.length<count)
                    messages.push({content:message.value?.toString() || ""})
            },
        });

        return messages;
}


