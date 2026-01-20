import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const signup = async (name, email, password) => {
  const response = await api.post("/auth/signup", { name, email, password });
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("user");
}

export const getSyllabus = async () => {
  const response = await api.get("/syllabus");
  return response.data;
};

export const createSyllabus = async (syllabusData) => {
  const response = await api.post("/syllabus", syllabusData);
  return response.data;
};

export const deleteSyllabus = async (id) => {
  const response = await api.delete(`/syllabus/${id}`);
  return response.data;
};

// Chapter Management
export const addChapter = async (syllabusId, subjectId, name) => {
  const response = await api.post(`/syllabus/${syllabusId}/chapters/${subjectId}`, { name });
  return response.data;
};

export const renameChapter = async (syllabusId, subjectId, chapterId, name) => {
  const response = await api.put(`/syllabus/${syllabusId}/chapters/${subjectId}/${chapterId}/name`, { name });
  return response.data;
};

export const deleteChapter = async (syllabusId, subjectId, chapterId) => {
  const response = await api.delete(`/syllabus/${syllabusId}/chapters/${subjectId}/${chapterId}`);
  return response.data;
};

export const updateChapterStatus = async (syllabusId, subjectId, chapterId, completed) => {
  const response = await api.put(`/syllabus/${syllabusId}/chapters/${subjectId}/${chapterId}`, { completed });
  return response.data;
};

export const getTodos = async () => {
  const response = await api.get("/todos");
  return response.data;
};

export const createTodo = async (todoData) => {
  const response = await api.post("/todos", todoData);
  return response.data;
};

export const updateTodo = async (id, todoData) => {
  const response = await api.put(`/todos/${id}`, todoData);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

// AI
export const chatWithAI = async (message) => {
  const response = await api.post('/ai/chat', { message });
  return response.data;
};

export const parsePDF = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);
  const response = await api.post('/ai/parse-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export default api;
