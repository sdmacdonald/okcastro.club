export const getMonth = () => {
  const d = new Date();
  const currentMonth = parseInt(d.getMonth() + 1);
  return {
    value: currentMonth,
    month: d.toLocaleDateString("en-US", { month: "long" }),
  };
};

export const getDateTime = (dateTime) => {
  let d = new Date(dateTime);
  let day = d.toLocaleDateString("en-us", { day: "2-digit" });
  let month = d.toLocaleDateString("en-US", { month: "long" });
  let time = d.toLocaleTimeString("en-US", { timeStyle: "short" });
  return `${month} ${day}, ${time}:`;
};
