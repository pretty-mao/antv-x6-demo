import axios from "axios";

const request = axios.create({});

request({
  headers: {
    "Content-Type": "application/json",
  },
});
