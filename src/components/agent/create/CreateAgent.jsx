"use client";

import { useRef } from "react";
import feathers from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import axios from "axios";
import authentication from "@feathersjs/authentication-client";

const CreateAgent = () => {
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

  const handleCreate = async () => {
    //handle the creation of agent
    const agent = getAgentInput();
    console.log(agent);
    const { user } = await app.reAuthenticate();
    await app
      .service("agent")
      .create(agent)
      .then((dbAgent) => {
        console.log("agent created succesfully", dbAgent);
        window.location.href = "/agent";
      })
      .catch((error) => {
        console.error("Error creating agent: ", error);
      });
  };

  const getAgentInput = () => {
    const agent = {
      name: document.querySelector('[name="name"]').value,
      cash: document.querySelector('[name="cash"]').value,
      multiplier: document.querySelector('[name="multiplier"]').value,
      timespan: document.querySelector('[name="timespan"]').value,
      preferences: document.querySelector('[name="preferences"]').value,
    };
    if (
      !(
        agent.name &&
        agent.cash &&
        agent.multiplier &&
        agent.timespan &&
        agent.preferences
      )
    ) {
      return;
    }
    document.querySelector('[name="name"]').value = "";
    document.querySelector('[name="cash"]').value = "";
    document.querySelector('[name="multiplier"]').value = "";
    document.querySelector('[name="timespan"]').value = "";
    document.querySelector('[name="preferences"]').value = "";

    return agent;
  };
  return (
    <div>
      <div>
        <h1>Create Matrix Agent</h1>
      </div>
      <form>
        <div>
          <label for="name" class="label">
            <span class="label-text">Name: </span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="enter name"
            class="input input-bordered"
          />
        </div>
        <div>
          <label for="cash" class="label">
            <span class="label-text">Cash: </span>
          </label>
          <input
            type="number"
            name="cash"
            placeholder="cash amount"
            class="input input-bordered"
          />
        </div>
        <div>
          <label for="execution" class="label">
            <span class="label-text">Execution: </span>
          </label>
          <input
            type="number"
            name="multiplier"
            placeholder="Number"
            class="input input-bordered"
          />
          <input
            type="text"
            name="timespan"
            placeholder="hour/day/week"
            class="input input-bordered"
          />
          <span> "- The agent will work every X hours/days/weeks"</span>
        </div>
        <div>
          <label for="preferences" class="label">
            <p class="label-text">Preferences: </p>
          </label>
          <textarea
            id="preferences"
            name="preferences"
            rows="5"
            cols="33"
            placeholder="Enter your preferences"
            class="input input-bordered"
          ></textarea>
        </div>
        <div>
          <button type="button" onClick={handleCreate}>
            Create Agent
          </button>
        </div>
        {/* <div>
          <button id="signup" type="button" onClick={handleSignup}>
            Signup
          </button>
        </div> */}
      </form>
    </div>
  );
};

export default CreateAgent;
