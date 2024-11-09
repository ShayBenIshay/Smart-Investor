function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

class PolygonCallsQueue {
  constructor() {
    this.queue = [];
    this.MAX_CONCURRENT_CALLS = 4;
    this.currentCallCount = 0;
    this.isMinuteTimerRunning = false;
  }

  addToQueue(apiCall, priority = "low") {
    return new Promise((resolve, reject) => {
      this.queue.push({ apiCall, priority, resolve, reject });
      this.processQueue();
    });
  }

  startMinuteTimer() {
    if (!this.isMinuteTimerRunning) {
      this.isMinuteTimerRunning = true;
      setTimeout(() => {
        this.currentCallCount = 0;
        this.isMinuteTimerRunning = false;
        this.processQueue();
      }, 60000);
    }
  }

  async processQueue() {
    if (this.isMinuteTimerRunning) return;
    this.startMinuteTimer();

    if (
      this.currentCallCount >= this.MAX_CONCURRENT_CALLS ||
      this.queue.length === 0
    ) {
      return;
    }

    this.queue.sort((a, b) =>
      a.priority === "high" && b.priority === "low" ? -1 : 1
    );

    const { apiCall, priority, resolve, reject } = this.queue.shift();
    console.log("priority priority priority priority ", priority);
    if (priority === "low") await sleep(20000);
    this.currentCallCount++;
    console.log(
      "currentCallCount currentCallCount currentCallCount currentCallCount ",
      this.currentCallCount
    );

    try {
      const result = await apiCall();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.currentCallCount--;
      this.processQueue();
    }
  }
}

const polygonCallsQueueInstance = new PolygonCallsQueue();

export const addToQueue = (apiCall, priority) => {
  return polygonCallsQueueInstance.addToQueue(apiCall, priority);
};
