import { pipeline } from '@xenova/transformers';

let extractor = null;

export const getEmbeddings = async (text) => {
    if (!extractor) {
        // using a small, quantized model for browser speed
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    const output = await extractor(text, { pooling: 'mean', normalize: true });
    // Convert Tensor to Array
    return Array.from(output.data);
};
