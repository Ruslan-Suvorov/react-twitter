export const getDate = (time) => {
  const date = new Date(time);
  const months = [
    "jun",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const hours = date.getHours().toString();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${hours}:${minutes}`;
};
