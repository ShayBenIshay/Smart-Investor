import { savePriceToCache } from "./cache";

class Throttle {
  constructor(maxCallsPerMinute) {
    if (this.instance) return this.instance;
    this.instance = this;

    this.maxCallsPerMinute = maxCallsPerMinute;
    this.apiKey = process.env.POLYGON_API_KEY;
    this.callQueue = [];
    this.callCount = 0;
    this.isRunning = false;
    this.resetRateLimit();
  }

  resetRateLimit() {
    const intervalId = setInterval(() => {
      if (this.callQueue.length > 0) {
        console.log("Resetting rate limit...");
        this.callCount = 0;
        this.processQueue();
      } else {
        console.log("No pending calls. Clearing interval...");
        clearInterval(intervalId);
      }
    }, 60000);
  }

  enqueue(symbol, tradingDate, priority = "system") {
    return new Promise((resolve, reject) => {
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

          await savePriceToCache(symbol, data.close, tradingDate);

          console.log("Saved price to cache successfully.");
          resolve(data);
        } catch (error) {
          console.error("Error in API call:", error);
          reject(error);
        }
      };

      const callData = { apiCall, priority };

      if (priority === "user") {
        this.callQueue.unshift(callData);
      } else {
        this.callQueue.push(callData);
      }

      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isRunning) return;
    this.isRunning = true;
    while (
      this.callQueue.length > 0 &&
      this.callCount < this.maxCallsPerMinute
    ) {
      const { apiCall } = this.callQueue.shift();

      this.callCount++;
      await apiCall();
    }

    this.isRunning = false;
  }
}
const throttle = new Throttle(5);

export default throttle.enqueue.bind(throttle);
