import mockData from "../app/mockData";
import { Data } from "../types/types";


export const API = {
getData: (): Promise<Data[]> => new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 1000);
  }),
};