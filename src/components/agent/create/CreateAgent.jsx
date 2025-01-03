"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import feathers from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import axios from "axios";
import authentication from "@feathersjs/authentication-client";

const CreateAgent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    cash: "",
    multiplier: "",
    timespan: "",
    preferences: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation
    if (!Object.values(formData).every((value) => value)) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const { user } = await app.reAuthenticate();
      await app.service("agent").create({
        func: "create",
        ...formData,
      });

      router.push("/agent");
    } catch (error) {
      setError(error.message);
      console.error("Error creating agent: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Matrix Agent</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleCreate}>
        <div>
          <label htmlFor="name" className="label">
            <span className="label-text">Name: </span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="enter name"
            className="input input-bordered"
          />
        </div>
        <div>
          <label htmlFor="cash" className="label">
            <span className="label-text">Cash: </span>
          </label>
          <input
            type="number"
            name="cash"
            value={formData.cash}
            onChange={handleChange}
            placeholder="cash amount"
            className="input input-bordered"
          />
        </div>
        <div>
          <label htmlFor="execution" className="label">
            <span className="label-text">Execution: </span>
          </label>
          <input
            type="number"
            name="multiplier"
            value={formData.multiplier}
            onChange={handleChange}
            placeholder="Number"
            className="input input-bordered"
          />
          <input
            type="text"
            name="timespan"
            value={formData.timespan}
            onChange={handleChange}
            placeholder="hour/day/week"
            className="input input-bordered"
          />
          <span> - The agent will work every X hours/days/weeks</span>
        </div>
        <div>
          <label htmlFor="preferences" className="label">
            <p className="label-text">Preferences: </p>
          </label>
          <textarea
            id="preferences"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
            rows="5"
            cols="33"
            placeholder="Enter your preferences"
            className="input input-bordered"
          ></textarea>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Agent"}
        </button>
      </form>
    </div>
  );
};

export default CreateAgent;
