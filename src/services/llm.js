export const chatWithLLM = async (messages, config = {}) => {
    const DEFAULT_URL = 'http://localhost:11434/v1/chat/completions';
    const url = localStorage.getItem('llm_url') || DEFAULT_URL;
    const model = localStorage.getItem('llm_model') || 'llama3'; // Default to a common local model

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: false, // For simplicity in v1, can upgrade to stream
            }),
        });

        if (!response.ok) {
            throw new Error(`LLM API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "I am unable to respond right now.";
    } catch (error) {
        console.error("LLM Service Error:", error);
        return "Error connecting to AI Provider. Please check Settings.";
    }
};
