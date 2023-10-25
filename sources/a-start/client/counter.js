import axios from "axios";

export const fetchTodos = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/todos"
  );

  return response.data;
};

export function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}
