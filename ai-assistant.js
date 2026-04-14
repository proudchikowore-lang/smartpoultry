// ============================================================================
// AI ASSISTANT - SMART POULTRY SYSTEM (GROQ VERSION - UPDATED)
// ============================================================================

// ⚠️ IMPORTANT: Replace with your NEW Groq API key
const GROQ_API_KEY = "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";

// Groq OpenAI-compatible endpoint
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// ✅ Supported active Groq models (2026)
// Recommended fast model:
const GROQ_MODEL = "llama-3.1-8b-instant";
// Alternative stronger model:
// const GROQ_MODEL = "llama-3.1-70b-versatile";

// ================= DOM ELEMENTS =================
const aiToggle = document.getElementById("aiAssistantToggle");
const aiContainer = document.getElementById("aiChatContainer");
const aiClose = document.getElementById("aiChatClose");
const aiMessages = document.getElementById("aiChatMessages");
const aiInput = document.getElementById("aiChatInput");
const aiSend = document.getElementById("aiChatSend");

// ================= CHAT TOGGLE =================
if (aiToggle) {
    aiToggle.addEventListener("click", () => {
        aiContainer.classList.toggle("active");
    });
}

if (aiClose) {
    aiClose.addEventListener("click", () => {
        aiContainer.classList.remove("active");
    });
}

// ================= SEND MESSAGE =================
if (aiSend) {
    aiSend.addEventListener("click", sendMessage);
}

if (aiInput) {
    aiInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
}

async function sendMessage() {
    const userText = aiInput.value.trim();
    if (!userText) return;

    appendMessage("user", userText);
    aiInput.value = "";
    showTypingIndicator();

    try {
        const sensorContext = getSensorContext();

        const response = await fetch(GROQ_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: "system",
content: `You are a specialized expert poultry farm consultant for the Zimbabwean agricultural sector (2026). 
Base your advice on current sensor data and the following Zimbabwean-specific guidelines:

1. CLIMATE: Account for Zimbabwe's seasons (Main Rainy: Nov-Mar; Cold/Dry: May-July; Hot/Dry: Aug-Oct). 
2. POWER: Address 'load shedding' risks. If sensors show critical levels (e.g., low temp in winter), suggest backup heating (charcoal/gas) or solar alternatives.
3. STANDARDS: Reference optimal broiler parameters common in Zimbabwe (e.g., Brooding circle of 6 weeks, temps of 32°C-34°C for chicks).
4. DISEASES: Monitor for regional risks like Newcastle Disease, Gumboro (IBD), and Avian Influenza.
5. FEED: Consider local feed availability (e.g., National Foods Triphase, Agrifoods).

Provide structured, professional recommendations using bullet points. Be concise and proactive.`
                    },
                    {
                        role: "user",
                        content: sensorContext + "\n\nUser Question:\n" + userText
                    }
                ],
                temperature: 0.7,
                max_tokens: 800
            })
        });

        const data = await response.json();

        removeTypingIndicator();

        if (!response.ok) {
            throw new Error(data.error?.message || "Groq API request failed");
        }

        const aiReply = data.choices?.[0]?.message?.content || "No response received.";
        appendMessage("assistant", aiReply);

    } catch (error) {
        removeTypingIndicator();
        appendMessage("assistant", "⚠️ Error: " + error.message);
        console.error("Groq AI Error:", error);
    }
}

// ================= SENSOR CONTEXT =================
function getSensorContext() {
    const temperature = document.getElementById("temperature")?.textContent || "--";
    const humidity = document.getElementById("humidity")?.textContent || "--";
    const light = document.getElementById("light")?.textContent || "--";
    const feed = document.getElementById("feed")?.textContent || "--";

    return `
Current Poultry House Conditions:
- Temperature: ${temperature}
- Humidity: ${humidity}
- Light Level: ${light}
- Feed Level: ${feed}
`;
}

// ================= MESSAGE UI =================
function appendMessage(role, text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `ai-message ${role}`;

    const avatar = document.createElement("div");
    avatar.className = "ai-message-avatar";
    avatar.textContent = role === "assistant" ? "🤖" : "👤";

    const content = document.createElement("div");
    content.className = "ai-message-content";
    content.innerHTML = text.replace(/\n/g, "<br>");

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    aiMessages.appendChild(messageDiv);

    aiMessages.scrollTop = aiMessages.scrollHeight;
}

// ================= TYPING INDICATOR =================
function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "ai-message assistant";
    typingDiv.id = "typingIndicator";

    typingDiv.innerHTML = `
        <div class="ai-message-avatar">🤖</div>
        <div class="ai-typing-indicator">
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
        </div>
    `;

    aiMessages.appendChild(typingDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById("typingIndicator");
    if (typing) typing.remove();
}