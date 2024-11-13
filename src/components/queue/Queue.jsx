"use client";

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

class MyQueue {
  constructor() {
    if (MyQueue.instance) {
      throw new Error("You can only create one instance of MySingletonClass!");
    }
    MyQueue.instance = this;

    this.MAX_CALLS = 5;
    this.callCount = 0;
    this.queue = [];
  }

  static getInstance() {
    if (!MyQueue.instance) {
      MyQueue.instance = new MyQueue();
    }
    return MyQueue.instance;
  }

  addToQueue(ticker, date, priority = "low") {
    this.queue.push({ ticker, date, priority });
    this.processQueue();
  }

  async processQueue() {
    if (this.queue.length === 0) return;
    if (this.callCount >= this.MAX_CALLS) {
      await sleep(8000);
      this.processQueue();
      return;
    }
    if (this.callCount === 0) {
      setTimeout(() => {
        this.callCount = 0;
      }, 20000);
    }

    this.queue.sort((a, b) =>
      a.priority === "high" && b.priority === "low" ? -1 : 1
    );

    const { ticker, date, priority } = this.queue.shift();
    this.callCount++;

    try {
      const response = await fetch(
        `/api/fetchPolygonClosePrice?symbol=${ticker}&date=${date}&user=${
          priority === "high" ? "true" : "false"
        }`
      );
      if (!response.ok) {
        this.addToQueue(ticker, date, priority);
        throw new Error("Failed to fetch close price");
      }
    } catch (error) {
      console.error("Error fetching price:", error);
      return null;
    }
  }
}

export default MyQueue;

// const Queue = () => {
//   const [queueInstance] = useState(() => new MyQueue());
//   const [queueState, setQueueState] = useState([]);

//   const handleAddToQueue = (ticker, date, priority) => {
//     queueInstance.addToQueue(ticker, date, priority);
//     setQueueState([...queueInstance.queue]);
//   };

//   return (
//     <div>
//       <div>
//         <h1>Queue Name: {queueInstance.name}</h1>
//         <button onClick={() => handleAddToQueue("MSFT", "2023-01-09", "low")}>
//           Add Low Priority Call
//         </button>
//         <button onClick={() => handleAddToQueue("MSFT", "2023-01-09", "high")}>
//           Add High Priority Call
//         </button>

//         <h2>Queue State:</h2>
//         <ul>
//           {queueState.map((item, index) => (
//             <li key={index}>
//               Call: {item.call}, Priority: {item.priority}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Queue;
