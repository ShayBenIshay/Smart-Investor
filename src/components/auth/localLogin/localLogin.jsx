"use client";

import { useRef } from "react";
import feathers from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import axios from "axios";
import authentication from "@feathersjs/authentication-client";

const LocalLogin = () => {
  const appRef = useRef(null);
  if (!appRef.current) {
    const app = feathers();
    const restClient = rest(process.env.NEXT_PUBLIC_REST_SERVICES_CLIENT_URL);
    app.configure(restClient.axios(axios));
    app.configure(
      authentication({
        storage: typeof window !== "undefined" ? window.localStorage : null,
      })
    );
    appRef.current = app;
  }
  const app = appRef.current;

  const handleSignup = async () => {
    const credentials = getCredentials();

    await app
      .service("users")
      .create(credentials)
      .then((user) => {
        console.log("User created successfully:", user);
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });

    handleLogin();
  };

  const handleLogin = async () => {
    const credentials = getCredentials();
    if (!(credentials?.email && credentials?.password)) {
      return;
    }
    app
      .authenticate({
        strategy: "local",
        ...credentials,
      })
      .then((response) => {
        console.log("Authenticated successfully", response);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Authentication error", error);
      });
  };

  const getCredentials = () => {
    const user = {
      email: document.querySelector('[name="email"]').value,
      password: document.querySelector('[name="password"]').value,
    };

    return user;
  };
  return (
    <div>
      <div>
        <h1>Smart Investor</h1>
      </div>
      <form>
        <div>
          <label for="email" class="label">
            <span class="label-text">Email: </span>
          </label>
          <input
            type="text"
            name="email"
            placeholder="enter email"
            class="input input-bordered"
          />
        </div>
        <div>
          <label for="password" class="label">
            <span class="label-text">Password: </span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="enter password"
            class="input input-bordered"
          />
        </div>
        <div>
          <button id="login" type="button" onClick={handleLogin}>
            Login
          </button>
        </div>
        <div>
          <button id="signup" type="button" onClick={handleSignup}>
            Signup
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocalLogin;
