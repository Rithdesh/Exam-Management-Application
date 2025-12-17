import API from "./api";
export const getHalls = () => API.get("/examallocation/halls");
export const createHall = (data) => API.post("/examallocation/halls", data);
