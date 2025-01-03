"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeathers } from "@/services/feathers";
import styles from "./createAgent.module.css";

const CreateAgent = () => {
  const router = useRouter();
  const app = useFeathers();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cash: "",
    multiplier: "",
    timespan: "",
    preferences: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    // Validate all fields are filled
    if (!Object.values(formData).every((value) => value)) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await app.reAuthenticate();

      // Format the data properly before sending
      const agentData = {
        func: "create",
        name: formData.name,
        cash: parseFloat(formData.cash), // Ensure it's a number
        multiplier: parseInt(formData.multiplier, 10), // Ensure it's an integer
        timespan: formData.timespan,
        preferences: formData.preferences,
      };

      // Validate cash is a valid number
      if (isNaN(agentData.cash)) {
        alert("Please enter a valid cash amount");
        return;
      }

      await app.service("agent").create(agentData);
      router.push("/agent");
    } catch (error) {
      console.error("Error creating agent: ", error?.data || error);
      // More detailed error message
      const errorMessage =
        error?.data?.map((e) => e.message).join("\n") ||
        "Failed to create agent. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Matrix Agent</h1>
      <form className={styles.form} onSubmit={handleCreate}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className={styles.input}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cash" className={styles.label}>
            Cash:
          </label>
          <input
            type="number"
            id="cash"
            name="cash"
            value={formData.cash}
            onChange={handleChange}
            placeholder="Cash amount"
            className={styles.input}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="execution" className={styles.label}>
            Execution:
          </label>
          <div className={styles.executionInputs}>
            <input
              type="number"
              name="multiplier"
              value={formData.multiplier}
              onChange={handleChange}
              placeholder="Number"
              className={styles.input}
              disabled={isLoading}
            />
            <input
              type="text"
              name="timespan"
              value={formData.timespan}
              onChange={handleChange}
              placeholder="hour/day/week"
              className={styles.input}
              disabled={isLoading}
            />
          </div>
          <span className={styles.hint}>
            The agent will work every X hours/days/weeks
          </span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="preferences" className={styles.label}>
            Preferences:
          </label>
          <textarea
            id="preferences"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
            rows="5"
            placeholder="Enter your preferences"
            className={styles.textarea}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Agent"}
        </button>
      </form>
    </div>
  );
};

export default CreateAgent;
