import axios from "axios";
import "./style.css";

// Function Declaration
const doAuthentication = async (e) => {
  e.preventDefault();

  const email = document.querySelector("#formLoginEmail").value;
  const password = document.querySelector("#formLoginPassword").value;

  console.log(email, password);

  const { data } = await axios.post("http://localhost:3000/login", {
    email,
    password,
  });

  // When authentication success, save token to localStorage
  localStorage.setItem("accessToken", data.data.access_token);

  // Do the login (show #privateRoute) and then clear the form
  await doLogin();
  doClearForm();
};

const fetchDataUsersAndRenderUserProfile = async () => {
  // Show UserProfile Logic:
  // 1. Fetch data users (GET /private from backend, need to send token via header Authorization)
  // 2. Render data users to DOM (#userProfile)
  try {
    const { data } = await axios.get("http://localhost:3000/private", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const userProfile = document.querySelector("#userProfile");
    const innerUserProfile = `Hello, ${data.data.email} (id: ${data.data.id})!`;
    userProfile.innerHTML = innerUserProfile;
  } catch (err) {
    console.log(err);
  }
};

const fetchTodosAndRenderTable = async () => {
  // Show TodoTable Logic:
  // 1. Fetch data todos (GET /todos from jsonplaceholder)
  // 2. Only get First 10 data
  // 3. Map todos to innerTable (tr, td)
  // 4. Render todos to DOM (table - privateTableBody - innerHTML)

  try {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
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

const doLogin = async () => {
  // Login Logic:
  // 1. Show #privateRoute
  // 2. Hide #formLogin
  // 3. Fetch data users (GET /private from backend)
  // 4. Render data users to DOM (#userProfile)
  // 5. Fetch data todos (straight to jsonplaceholder)
  // 6. Render data todos to DOM (table)
  document.querySelector("#formLogin").classList.toggle("hidden");
  document.querySelector("#privateRoute").classList.toggle("hidden");

  await fetchDataUsersAndRenderUserProfile();
  await fetchTodosAndRenderTable();
};

const doLogout = () => {
  // Logout Logic:
  // 1. Remove localStorage
  // 2. Show #formLogin
  // 3. Hide #privateRoute
  localStorage.removeItem("accessToken");

  document.querySelector("#formLogin").classList.toggle("hidden");
  document.querySelector("#privateRoute").classList.toggle("hidden");
};

const doClearForm = () => {
  document.querySelector("#formLoginEmail").value = "";
  document.querySelector("#formLoginPassword").value = "";
};

const initialize = () => {
  // Hide #privateRoute
  document.querySelector("#privateRoute").classList.toggle("hidden");

  // Add event submit (fn doAuthentication) to #formLogin
  document
    .querySelector("#formLogin")
    .addEventListener("submit", doAuthentication);

  // Add event click (fn doLogout) to anchor #doLogout
  document.querySelector("#doLogout").addEventListener("click", doLogout);

  // do the Login if localStorage token exist
  if (localStorage.getItem("accessToken")) {
    doLogin();
  }
};
// End of Function Declaration

// Runner
initialize();
