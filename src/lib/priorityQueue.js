// const queue = [];
// const MAX_CONCURRENT_CALLS = 5;
// let currentCallCount = 0;
// let isMinuteTimerRunning = false;

// export const addToQueue = (apiCall, priority = "low") => {
//   return new Promise((resolve, reject) => {
//     queue.push({ apiCall, priority, resolve, reject });
//     // console.log(
//     //   "queue.length queue.length queue.length queue.length queue.length queue.length "
//     // );
//     // console.log(queue.length);
//     processQueue();
//   });
// };

// const startMinuteTimer = () => {
//   if (!isMinuteTimerRunning) {
//     isMinuteTimerRunning = true;
//     setTimeout(() => {
//       currentCallCount = 0;
//       isMinuteTimerRunning = false;
//       processQueue();
//     }, 60000);
//   }
// };

// const processQueue = async () => {
//   startMinuteTimer();

//   if (currentCallCount >= MAX_CONCURRENT_CALLS || queue.length === 0) {
//     return;
//   }

//   queue.sort((a, b) =>
//     a.priority === "high" && b.priority === "low" ? -1 : 1
//   );

//   const { apiCall, priority, resolve, reject } = queue.shift();

//   currentCallCount++;

//   try {
//     const result = await apiCall();
//     resolve(result);
//   } catch (error) {
//     reject(error);
//   } finally {
//     currentCallCount--;
//   }

//   const delay = priority === "low" ? 20000 : 0;
//   setTimeout(processQueue, delay);
// };
