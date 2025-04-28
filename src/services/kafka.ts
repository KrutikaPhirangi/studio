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

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate occasional errors
const shouldSimulateError = (probability = 0.1) => Math.random() < probability;


/**
 * Asynchronously retrieves the connection status to the Kafka broker.
 * Simulates network delay and potential errors.
 *
 * @returns A promise that resolves to a KafkaConnectionStatus object.
 */
export async function getKafkaConnectionStatus(): Promise<KafkaConnectionStatus> {
  await delay(Math.random() * 500 + 200); // Simulate 200-700ms delay

  if (shouldSimulateError(0.05)) { // 5% chance of connection error
    console.error("Simulating Kafka connection error");
    throw new Error("Simulated connection error: Could not reach Kafka broker.");
  }

  // Simulate connection status (e.g., 90% chance of being connected)
  const isConnected = Math.random() > 0.1;
  return {
    isConnected,
  };
}

/**
 * Asynchronously retrieves a list of Kafka topics for a given environment.
 * Simulates network delay and potential errors.
 *
 * @param env The environment to filter topics by (e.g., 'dev', 'sandbox').
 * @returns A promise that resolves to an array of KafkaTopic objects.
 */
export async function getKafkaTopics(env: string): Promise<KafkaTopic[]> {
  await delay(Math.random() * 800 + 300); // Simulate 300-1100ms delay

  if (shouldSimulateError()) {
    console.error("Simulating error fetching Kafka topics");
    throw new Error(`Simulated error: Failed to list topics for env '${env}'.`);
  }

  // Simulate different topics based on environment
  let baseTopics: string[] = [];
  if (env === 'dev') {
      baseTopics = ['orders', 'customers', 'payments', 'inventory_updates', 'user_signups', 'product_views'];
  } else if (env === 'sandbox') {
      baseTopics = ['test_orders', 'sandbox_users', 'mock_payments'];
  } else {
      // Default or handle other environments
      baseTopics = ['generic_events', 'system_logs'];
  }

  // Simulate some environments having no topics
  if (env === 'empty_env_example') {
      return [];
  }


  return baseTopics.map(topic => ({
    name: `${env}.${topic}`,
  }));
}

/**
 * Asynchronously retrieves the latest N messages from a specific Kafka topic.
 * Simulates network delay, potential errors, and different message formats.
 *
 * @param topic The name of the Kafka topic.
 * @param count The number of messages to retrieve.
 * @returns A promise that resolves to an array of KafkaMessage objects.
 */
export async function getKafkaMessages(topic: string, count: number): Promise<KafkaMessage[]> {
   await delay(Math.random() * 1000 + 500); // Simulate 500-1500ms delay

   if (shouldSimulateError()) {
    console.error("Simulating error fetching Kafka messages");
    throw new Error(`Simulated error: Failed to fetch messages for topic '${topic}'.`);
  }

   // Simulate no messages for some topics
   if (topic.includes('empty_topic_example')) {
     return [];
   }

   return Array.from({ length: count }, (_, i) => {
     // Simulate different message formats (JSON vs plain string)
     const isJson = Math.random() > 0.3; // 70% chance of JSON
     let content: string | Record<string, any>;

     if (isJson) {
       content = {
         id: `msg_${topic}_${Date.now()}_${i}`,
         timestamp: new Date().toISOString(),
         user_id: `user_${Math.floor(Math.random() * 1000)}`,
         payload: {
           details: `Event detail ${i + 1} for ${topic}`,
           value: Math.random() * 100,
           status: ['pending', 'processed', 'failed'][Math.floor(Math.random() * 3)],
         },
         metadata: {
           source: 'kafkalook-simulator',
           partition: Math.floor(Math.random() * 3),
           offset: 1000 + i,
         }
       };
       // Convert JSON object to string for display in <pre> tag
       try {
        content = JSON.stringify(content, null, 2); // Pretty print JSON
       } catch (e) {
        content = "{ \"error\": \"Failed to stringify JSON content\" }";
       }

     } else {
       content = `Simple message ${i + 1}: This is a plain text event from topic ${topic} at ${new Date().toLocaleTimeString()}`;
     }

     return { content };
   });
}
