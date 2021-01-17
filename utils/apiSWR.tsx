import axios, { AxiosResponse } from "axios";

export default async function apiSWR(
  path: string
): Promise<AxiosResponse<any>> {
  return axios.get(path);
}
