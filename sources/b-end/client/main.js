import axios from "axios";
import "./style.css";

// Function Declaration
const doLogin = (e) => {
  e.preventDefault();

  const email = document.querySelector("#formLoginEmail").value;
  const password = document.querySelector("#formLoginPassword").value;

  console.log(email, password);
};

const goToLogin = (e) => {
  e.preventDefault();

  document.querySelector("#formLogin").classList.remove("hidden");
  document.querySelector("#formRegister").classList.add("hidden");
  document.querySelector("#privateRoute").classList.add("hidden");
};

const doRegister = (e) => {
  e.preventDefault();

  const username = document.querySelector("#formRegisterUsername").value;
  const email = document.querySelector("#formRegisterEmail").value;
  const password = document.querySelector("#formRegisterPassword").value;

  console.log(username, email, password);
};

const goToRegister = (e) => {
  e.preventDefault();

  document.querySelector("#formLogin").classList.add("hidden");
  document.querySelector("#formRegister").classList.remove("hidden");
  document.querySelector("#privateRoute").classList.add("hidden");
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

  // Add event submit (fn doLogin) to #formLogin
  document.querySelector("#formLogin").addEventListener("submit", doLogin);

  // Hide #formRegister
  document.querySelector("#formRegister").classList.toggle("hidden");

  // Add event submit (fn doRegister) to #formRegister
  document
    .querySelector("#formRegister")
    .addEventListener("submit", doRegister);

  // Add event click (fn goToLogin) to #toLogin
  document.querySelector("#toLogin").addEventListener("click", goToLogin);

  // Add event click (fn goToRegister) to #toRegister
  document.querySelector("#toRegister").addEventListener("click", goToRegister);
};
// End of Function Declaration

// Runner
initialize();
