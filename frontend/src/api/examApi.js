import API from "./api";
export const getExams = () => API.get("/exams");
export const createExam = (data) => API.post("/exams", data);
