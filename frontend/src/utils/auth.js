export function getUsers() {
  return JSON.parse(localStorage.getItem("syloraUsers")) || [];
}

export function saveUser(email, password) {
  const users = getUsers();
  users.push({
    email,
    password,
    syllabi: [],
    todos: [],
  });
  localStorage.setItem("syloraUsers", JSON.stringify(users));
}

export function authenticate(email, password) {
  return getUsers().find(
    (u) => u.email === email && u.password === password
  );
}

export function setSession(user) {
  localStorage.setItem("syloraSession", JSON.stringify(user));
}

export function getSession() {
  return JSON.parse(localStorage.getItem("syloraSession"));
}

export function clearSession() {
  localStorage.removeItem("syloraSession");
}

export function saveSyllabus(email, syllabus) {
  const users = getUsers();
  const i = users.findIndex((u) => u.email === email);
  if (!Array.isArray(users[i].syllabi)) users[i].syllabi = [];
  users[i].syllabi.push(syllabus);
  localStorage.setItem("syloraUsers", JSON.stringify(users));
  setSession(users[i]);
}

export function getUserSyllabi(email) {
  return getUsers().find((u) => u.email === email)?.syllabi || [];
}

export function updateSyllabi(email, syllabi) {
  const users = getUsers();
  const i = users.findIndex((u) => u.email === email);
  users[i].syllabi = syllabi;
  localStorage.setItem("syloraUsers", JSON.stringify(users));
  setSession(users[i]);
}

/* ✅ TO-DOS */
export function getUserTodos(email) {
  return getUsers().find((u) => u.email === email)?.todos || [];
}

export function updateTodos(email, todos) {
  const users = getUsers();
  const i = users.findIndex((u) => u.email === email);
  users[i].todos = todos;
  localStorage.setItem("syloraUsers", JSON.stringify(users));
  setSession(users[i]);
}
