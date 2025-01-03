"use client";

import { useState } from "react";
import "./add.scss";

const Add = ({
  slug,
  formInput,
  setOpen,
  onDateChange,
  onSubmit,
  initialValues = {},
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If it's a date change and we have a ticker, fetch the price
    if (name === "executedAt" && formData.ticker && onDateChange) {
      try {
        const priceData = await onDateChange(formData.ticker, value);
        if (priceData?.close) {
          setFormData((prev) => ({ ...prev, price: priceData.close }));
        }
      } catch (error) {
        console.error("Failed to fetch price:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>
          X
        </span>
        <h1>Add new {slug}</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {formInput.map((input) => (
            <div className="item" key={input.name}>
              <label>{input.label}</label>
              {input.element === "input" && (
                <input
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  value={formData[input.name] || ""}
                  onChange={handleChange}
                  required
                />
              )}
              {input.element === "select" && (
                <select
                  name={input.name}
                  value={formData[input.name] || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select operation</option>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              )}
              {input.element === "datePicker" && (
                <input
                  type="date"
                  name={input.name}
                  value={formData[input.name] || ""}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
