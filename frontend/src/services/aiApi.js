const RAW_AI_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:5002';
const BACKEND_API_BASE = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '');

export const aiApi = {
  /**
   * Send chat message to LangGraph AI Microservice
   */
  async sendMessage(message, threadId = 'user-session', userContext = {}) {
    // Attempt 1: Direct to AI Microservice
    try {
      const res = await fetch(`${RAW_AI_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, threadId, userContext }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Direct call failed, fallback to backend proxy
    }

    // Attempt 2: Through backend proxy
    try {
      const res = await fetch(`${BACKEND_API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, threadId, userContext }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error('[AI Service API Error]:', error);
    }

    return {
      success: false,
      reply: "I'm currently unable to reach the MarketPulse AI engine. Please ensure the AI microservice is running on port 5002.",
      products: [],
      isOnTopic: true,
    };
  },

  /**
   * Get quick suggested prompt questions
   */
  async getQuickPrompts() {
    try {
      const res = await fetch(`${AI_BASE_URL}/api/ai/quick-prompts`);
      if (!res.ok) throw new Error('Failed to load prompts');
      return await res.json();
    } catch (error) {
      return {
        prompts: [
          { id: '1', label: '🔥 Best Sellers', query: 'Show me the highest rated trending products right now.' },
          { id: '2', label: '🎧 Audio & Gadgets', query: 'Find premium wireless audio and headphones.' },
          { id: '3', label: '🏢 Explore Stores', query: 'Which verified vendor stores are open today?' },
          { id: '4', label: '🛡️ Escrow & Protection', query: 'How does the MarketPulse ledger and escrow protection work?' },
        ]
      };
    }
  },

  /**
   * Health check for AI engine
   */
  async checkHealth() {
    try {
      const res = await fetch(`${AI_BASE_URL}/api/ai/health`);
      return await res.json();
    } catch (error) {
      return { status: 'offline' };
    }
  }
};
