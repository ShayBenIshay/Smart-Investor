// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useFeathers } from "@/services/feathers";
// import styles from "./agents.module.css";

// const dateToStr = (dateNumber) => {
//   const formatString = new Date(parseInt(dateNumber.$date.$numberLong, 10))
//     .toISOString()
//     .split("T")[0];
//   return formatString;
// };

// const Agents = () => {
//   const [agents, setAgents] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const app = useFeathers();
//   const router = useRouter();

//   const handleAgent = (agentId) => {
//     router.push(`/agent/${agentId}`);
//   };

//   const handleCreate = () => {
//     router.push("/agent/create");
//   };

//   useEffect(() => {
//     const getAgents = async () => {
//       try {
//         const { user } = await app.reAuthenticate();
//         const queryResponse = await app.service("agent").find({
//           query: {
//             name: "find",
//             userId: user._id,
//           },
//         });
//         setAgents(queryResponse);
//       } catch (error) {
//         console.error("Failed to fetch agents:", error);
//         setError(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getAgents();
//   }, [app]);

//   if (error) {
//     return (
//       <div className={styles.error}>Error loading agents: {error.message}</div>
//     );
//   }

//   if (isLoading) {
//     return <div className={styles.loading}>Loading...</div>;
//   }

//   if (!agents || agents.length === 0) {
//     return (
//       <div className={styles.container}>
//         <button
//           type="button"
//           onClick={handleCreate}
//           className={styles.createButton}
//         >
//           Create New Agent
//         </button>
//         <p className={styles.emptyMessage}>
//           No agents found. Create your first agent!
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <button
//         type="button"
//         onClick={handleCreate}
//         className={styles.createButton}
//       >
//         Create New Agent
//       </button>
//       <div className={styles.agentGrid}>
//         {agents.map((agent) => {
//           const createdAt = dateToStr(agent.createdAt);
//           return (
//             <button
//               key={agent._id}
//               onClick={() => handleAgent(agent._id)}
//               className={styles.agentCard}
//             >
//               <h3 className={styles.agentName}>{agent.name}</h3>
//               <div className={styles.agentDetails}>
//                 <p>Timespan: {agent.timespan}</p>
//                 <p>Preference: {agent.preferences}</p>
//                 <p>Created: {createdAt}</p>
//               </div>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Agents;
