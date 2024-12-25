"use client";

import { useState, useEffect } from "react";
import Wallet from "@/components/portfolio/wallet/Wallet";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";
import * as dotenv from "dotenv";

dotenv.config();

let app;
try {
  const socket = io(process.env.NEXT_PUBLIC_REST_SERVICES_CLIENT_URL);
  app = feathers();
  app.configure(socketio(socket));
  app.configure(authentication());
} catch (error) {
  console.error("failed to connect to Smart Investor Services");
}

const UserPage = () => {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const getPortfolio = async () => {
      const { user: currentUser } = await app.authenticate();
      if (currentUser) {
        const queryResponse = await app.service("portfolio").find({
          query: {
            name: "find",
            userId: currentUser._id,
          },
        });
        setPortfolio(queryResponse.data[0]);
      } else {
        setPortfolio(null);
      }
    };

    getPortfolio();
  }, []);

  if (portfolio) {
    return <Wallet liquid={portfolio?.cash} />;
  }
};

export default UserPage;
