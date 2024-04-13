import { Configuration, OpenAIApi } from "openai";

// Configure OpenAI API with the environment variable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Log unsupported method attempts and return 405 Method Not Allowed
    console.error(`Attempted to access with method: ${req.method}`);
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  // Log incoming request for debugging
  console.log("Received request with body:", req.body);

  try {
    const { message } = req.body;
    // Log the message to be processed
    console.log("Processing message:", message);

    // Call OpenAI to create an embedding
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: message,
    });

    // Log successful API call
    console.log("Embedding created successfully:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    // Log detailed error information
    console.error('OpenAI error:', error);
    res.status(500).json({ error: "Error creating embedding", details: error.message });
  }
}