import API from "./api";
export const createSchedule = (data) => API.post("/schedule", data);
export const getSchedule = () => API.get("/schedule");
export const getExaminerSchedule = (id) => API.get(`/schedule/examiner/${id}`);
