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
    setInterval(() => {
      console.log("Resetting rate limit...");
      this.callCount = 0;
      this.processQueue();
    }, 60000);
  }

  async enqueue(symbol, tradingDate, priority = "system") {
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
        console.log(
          "saved price to cache   saved price to cache   saved price to cache   saved price to cache   "
        );
      } catch (error) {
        console.error("Error in API call:", error);
      }
    };
    const callData = { apiCall, priority };
    if (priority === "user") {
      this.callQueue.unshift(callData);
    } else {
      this.callQueue.push(callData);
    }
    this.processQueue();
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
const throttle = new Throttle(4);

export default throttle.enqueue.bind(throttle);
