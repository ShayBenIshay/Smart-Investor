// "use client";

// import { useState, useEffect } from "react";
// import Wallet from "@/components/portfolio/wallet/Wallet";
// import { useFeathers } from "@/services/feathers";

// const UserPage = () => {
//   const [portfolio, setPortfolio] = useState(null);
//   const [error, setError] = useState(null);
//   const app = useFeathers();

//   useEffect(() => {
//     const getPortfolio = async () => {
//       try {
//         const { user: currentUser } = await app.authenticate();
//         if (currentUser) {
//           const queryResponse = await app.service("portfolio").find({
//             query: {
//               name: "find",
//               userId: currentUser._id,
//             },
//           });
//           setPortfolio(queryResponse.data[0]);
//         } else {
//           setPortfolio(null);
//         }
//       } catch (err) {
//         console.error("Failed to fetch portfolio", err);
//         setError(err);
//       }
//     };

//     getPortfolio();
//   }, [app]);

//   if (error) {
//     return <div>Error loading portfolio: {error.message}</div>;
//   }

//   if (!portfolio) {
//     return <div>Loading...</div>;
//   }

//   return <Wallet liquid={portfolio.cash} />;
// };

// export default UserPage;
