import API from "./api";

export const allocateHalls = (data) => {
  return API.post("/halls/allocate", data);
};
