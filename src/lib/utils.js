import { subDays } from "date-fns";

export const getLastTradingDate = () => {
  let yesterday = subDays(new Date(), 1);

  while (!isTradingDay(yesterday)) {
    yesterday = subDays(yesterday, 1);
  }

  return formatDate(yesterday);
};

export const isTradingDay = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("Invalid date provided");
  }
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

export const getTradingDates = (days) => {
  if (!Number.isInteger(days) || days < 1) {
    throw new Error("Days must be a positive integer");
  }

  const tradingDates = [];
  let currentDate = new Date();

  while (tradingDates.length < days) {
    currentDate = subDays(currentDate, 1);
    if (isTradingDay(currentDate)) {
      tradingDates.push(formatDate(currentDate));
    }
  }

  return tradingDates.reverse();
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
