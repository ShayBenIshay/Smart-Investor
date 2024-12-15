"use client";

import { useState, useEffect } from "react";
import Wallet from "@/components/portfolio/wallet/Wallet";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";

const socket = io("http://localhost:3030");
const app = feathers();
app.configure(socketio(socket));
app.configure(authentication());

const UserPage = () => {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const getPortfolio = async () => {
      const { user: currentUser } = await app.authenticate();
      if (currentUser) {
        const queryResponse = await app.service("portfolio").find({
          query: {
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
