# **App Name**: KafLook

## Core Features:

- Connection Status UI: Display Kafka connection status with a visual indicator.
- Topic Browser: List available Kafka topics based on the selected environment (dev, sandbox, etc.).
- Message Viewer: Display recent messages from a selected Kafka topic in a scrollable view.

## Style Guidelines:

- Primary color: Dark gray (#333) for the background to reduce eye strain.
- Secondary color: Light gray (#f0f0f0) for content sections to provide contrast.
- Accent: Teal (#008080) for interactive elements and status indicators.
- Use a monospaced font for displaying Kafka messages for better readability.
- Divide the UI into distinct sections for connection status, environment selection, topic list, and message viewer.
- Use clear and concise icons to represent different environments and actions.

## Original User Request:
Name of the Tool:
👉 "KafLook"
(short for Kafka Lookup — easy and catchy!)

📜 Overall Description:
Build a web-based UI with a Golang backend that connects automatically to a locally running Kafka broker.
The UI should show the Kafka connection status, allow users to view available topics by environment (dev, sandbox, etc.), and list event logs/messages from selected topics, without needing to run Kafka CLI commands manually.

🛠️ Backend (Golang):
Kafka Client: Use Go libraries like segmentio/kafka-go or Shopify/sarama.

Auto Connect: When backend server starts, it should immediately try to connect to the local Kafka (default: localhost:9092).

Kafka Health API: Create an API /connect-status that returns connection status (connected, disconnected).

List Topics API: Create an API /topics?env=dev that:

Lists all topics.

Filters topics based on the environment prefix (dev., sandbox., etc.).

Fetch Messages API: Create an API /events?topic=dev.orders that:

Consumes latest N messages (configurable, say last 10) from a specific topic.

Kafka Config: Allow Kafka broker address to be set via environment variables.

Error Handling: If Kafka is down, APIs should respond gracefully (with status).

🎨 Frontend (UI Page):
Connection Status:

A top header showing "Kafka Connection Status" with a red or green indicator.

Environment Selection:

A dropdown to select dev, sandbox, etc.

Fetch Topics Button:

Button labeled "Fetch Topics" that triggers /topics API based on selected env.

Topics List:

Show topics in a neat list or table format.

Clicking on a topic name will trigger /events API to fetch messages.

Messages Viewer:

Display the recent events/messages of the clicked topic in a scrollable section.

Minimalist Style:

Clean, developer-friendly UI.

Optional: Use React.js / VanillaJS / simple HTML+JS+CSS based on complexity.

🔥 Bonus Features (Optional but useful):
Manual Broker Reconnect Button: In case Kafka was not up initially.

Auto Refresh Topics: Option to refresh the topic list every X minutes.

Search Topics: Text search/filter topics by name.

Dark Mode: Easy on the eyes while debugging long sessions.
  