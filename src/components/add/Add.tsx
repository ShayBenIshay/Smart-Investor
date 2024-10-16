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
};

const Add = (props: Props) => {
  const [state, formAction] = useFormState(props.mutation, undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
                  onChange={(date: Date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={input.placeholder}
                />
              ) : (
                <input
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
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
