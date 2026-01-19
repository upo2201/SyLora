export function getUsers() {
  return JSON.parse(localStorage.getItem("syloraUsers")) || [];
}

export function saveUser(email, password) {
  const users = getUsers();
  users.push({ email, password });
  localStorage.setItem("syloraUsers", JSON.stringify(users));
}

export function authenticate(email, password) {
  const users = getUsers();
  return users.find(
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
