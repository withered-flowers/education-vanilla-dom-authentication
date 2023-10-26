import axios from "axios";
import "./style.css";

const doAuthentication = (e) => {
  e.preventDefault();

  const username = document.querySelector("#formLoginEmail").value;
  const password = document.querySelector("#formLoginPassword").value;

  console.log(username, password);
};

const fetchTodosAndRenderTable = async () => {
  try {
    const { data } = await axios.get(
      "http://jsonplaceholder.typicode.com/todos"
    );

    // Only get First 10 data
    const todos = data.slice(0, 10);

    // Render todos to DOM (table - privateTableBody)
    const privateTableBody = document.querySelector("#privateTableBody");

    const innerTable = todos.map((todo) => {
      return `
        <tr>
          <td>${todo.id}</td>
          <td>${todo.title}</td>
          <td>${todo.completed}</td>
        </tr>
      `;
    });

    privateTableBody.innerHTML = innerTable.join("");
  } catch (err) {
    console.log(err);
  }
};

const initialize = () => {
  // Hide #privateRoute
  document.querySelector("#privateRoute").classList.toggle("hidden");

  // Add event submit (fn doAuthentication) to #formLogin
  document
    .querySelector("#formLogin")
    .addEventListener("submit", doAuthentication);
};

initialize();
