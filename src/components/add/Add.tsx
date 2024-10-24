"use client";

import "./add.scss";
import { useFormState } from "react-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

type FormInput = {
  label: string;
  element: string;
  name: string;
  placeholder: string;
  type: string;
};
type Props = {
  slug: string;
  formInput: FormInput[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutation: (
    prevState: any,
    formData: FormData
  ) => Promise<void | { error: string }>;
  onDateChange?: (symbol: string, date: string) => Promise<any>;
};

const Add = (props: Props) => {
  const [state, formAction] = useFormState(props.mutation, undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  4;
  const [price, setPrice] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<string>("");

  const handleDateChange = async (date: Date, symbol: string) => {
    setSelectedDate(date);
    const dateOnly = date.toISOString().split("T")[0];
    if (props.onDateChange && symbol) {
      const price = await props.onDateChange(symbol, dateOnly);
      setPrice(price);
    }
  };

  const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    props.setOpen(false);
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Add new {props.slug}</h1>
        <form action={formAction} onSubmit={handleSubmit}>
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
                  name={input.name}
                  selected={selectedDate}
                  onChange={(date: Date) => handleDateChange(date, symbol)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={input.placeholder}
                />
              ) : (
                <input
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  value={input.name === "price" && price ? price : undefined}
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
          <button>Send</button>
          {state?.error}
        </form>
      </div>
    </div>
  );
};

export default Add;
