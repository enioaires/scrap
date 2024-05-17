import axios, { AxiosResponse, Method } from "axios";

export const apiAxios = axios.create({
  baseURL: "/api/",
});

export const api = async <Response, Data = any>({
  method,
  url,
  body,
}: {
  method: Method;
  url: string;
  body?: Data;
}): Promise<AxiosResponse<Response>> => {
  const response: AxiosResponse<Response> = await apiAxios.request<Response>({
    url,
    method,
    data:
      method === "POST" || method === "PUT" || method === "PATCH"
        ? body
        : undefined,
  });

  return response;
};
