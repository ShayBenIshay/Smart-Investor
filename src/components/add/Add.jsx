"use client";

import "./add.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { subDays, isToday } from "date-fns";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";

let app;
try {
  const socket = io(process.env.NEXT_PUBLIC_REST_SERVICES_CLIENT_URL);
  app = feathers();
  app.configure(socketio(socket));
  app.configure(authentication());
} catch (error) {
  console.error("failed to connect to Smart Investor Services");
}

const Add = (props) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [price, setPrice] = useState();
  const [symbol, setSymbol] = useState("");

  const handleDateChange = async (date, symbol) => {
    setSelectedDate(date);

    if (isToday(date)) {
      date = subDays(date, 1);
    }

    const dateOnly = formatDate(date);
    if (props.onDateChange && symbol) {
      const closePrice = await props.onDateChange(symbol, dateOnly);
      setPrice(closePrice);
    }
  };

  const handleTickerChange = (e) => {
    setSymbol(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(Number(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ticker = document.querySelector('[name="ticker"]').value;
    const price = document.querySelector('[name="price"]').value;
    const operation = document.querySelector('[name="operation"]').value;
    const papers = document.querySelector('[name="papers"]').value;
    props.setOpen(false);

    const { user } = await app.reAuthenticate();
    const executedAt = new Date();
    await app.service("transactions").create({
      ticker,
      price: parseFloat(price),
      executedAt,
      operation,
      papers: parseInt(papers, 10),
      agentId: {},
    });

    const queryResponse = await app.service("portfolio").find({
      query: {
        userId: user._id,
      },
    });
    const portfolio = queryResponse.data[0];
    const change = operation === "buy" ? price * papers : -price * papers;
    await app
      .service("portfolio")
      .patch(portfolio._id, { cash: portfolio.cash - change });

    window.location.reload();
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Add new {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          {props.formInput.map((input) => (
            <div className="item" key={input.label}>
              <label>{input.label}</label>

              {input.element === "select" ? (
                <select name={input.name}>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              ) : input.element === "datePicker" ? (
                <DatePicker
                  className="date"
                  name={input.name}
                  selected={selectedDate}
                  onChange={(date) => handleDateChange(date, symbol)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={input.placeholder}
                  autoComplete="off"
                />
              ) : (
                <input
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  value={input.name === "price" && price ? price : undefined}
                  autoComplete={input.name === "price" ? "off" : "on"}
                  onChange={
                    input.name === "ticker"
                      ? handleTickerChange
                      : input.name === "price"
                      ? handlePriceChange
                      : undefined
                  }
                />
              )}
            </div>
          ))}
          <button className="send-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
