class Throttler {
  constructor(maxCallsPerMinute, apiKey) {
    this.maxCallsPerMinute = maxCallsPerMinute; // Max API calls per minute
    this.apiKey = apiKey; // API key for authentication
    this.callQueue = []; // Queue to manage API calls
    this.callCount = 0; // Tracks the number of calls in the current window
    this.isRunning = false; // Whether the throttler is processing the queue
    this.resetRateLimit();
  }

  // Resets the call count every minute
  resetRateLimit() {
    setInterval(() => {
      console.log("Resetting rate limit...");
      this.callCount = 0;
      this.processQueue();
    }, 60000); // 60 seconds
  }

  // Adds a call to the queue
  enqueue(symbol, tradingDate, priority = "system") {
    const apiCall = async () => {
      const url = `https://api.polygon.io/v1/open-close/${symbol}/${tradingDate}?apiKey=${this.apiKey}`;
      console.log(`Executing API call to: ${url}`);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API call failed: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("API Response:", data);
      } catch (error) {
        console.error("Error in API call:", error);
      }
    };

    const callData = { apiCall, priority };
    if (priority === "user") {
      // User calls get added to the front of the queue
      this.callQueue.unshift(callData);
    } else {
      // System calls get added to the back of the queue
      this.callQueue.push(callData);
    }

    this.processQueue();
  }

  // Processes the API call queue
  async processQueue() {
    if (this.isRunning) return; // Prevent concurrent processing
    this.isRunning = true;

    while (
      this.callQueue.length > 0 &&
      this.callCount < this.maxCallsPerMinute
    ) {
      const { apiCall } = this.callQueue.shift(); // Dequeue the next call
      this.callCount++;
      await apiCall(); // Execute the API call
    }

    this.isRunning = false;
  }
}

// Singleton logic
let throttlerInstance = null;

export function getThrottlerInstance(maxCallsPerMinute = 5, apiKey = "") {
  if (!throttlerInstance) {
    throttlerInstance = new Throttler(maxCallsPerMinute, apiKey);
    console.log("Throttler singleton instance created");
  }
  return throttlerInstance;
}

export default Throttler;
