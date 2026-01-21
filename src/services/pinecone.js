import { Pinecone } from '@pinecone-database/pinecone';

const API_KEY = 'pcsk_4YkJ33_E5a2LzGZnapH8tk1NTzeBvfYX7WDAqRMAatBq66riqz4fcPZ941uTsSWHa2JMdY';
const INDEX_NAME = 'jarvis-memory';

let pinecone = null;

const getClient = () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: API_KEY,
      // In a browser environment, we might need a proxy or confirm this works via direct fetch 
      // if Pinecone supports CORS for browser. Recent versions do with specific setup, 
      // otherwise we might see CORS errors. 
      // For this "fast" prototype, we assume standard usage.
    });
  }
  return pinecone;
};

export const queryPinecone = async (vector, topK = 3) => {
  const client = getClient();
  const index = client.index(INDEX_NAME);
  try {
    const queryResponse = await index.query({
      vector: vector,
      topK: topK,
      includeMetadata: true,
    });
    return queryResponse.matches || [];
  } catch (error) {
    console.error("Pinecone Query Error:", error);
    return [];
  }
};

export const upsertVector = async (id, vector, text) => {
  const client = getClient();
  const index = client.index(INDEX_NAME);
  try {
    await index.upsert([{
      id,
      values: vector,
      metadata: { text },
    }]);
    return true;
  } catch (error) {
    console.error("Pinecone Upsert Error:", error);
    return false;
  }
};
