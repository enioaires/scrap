"use client";
import { AxiosResponse } from "axios";
import { api } from "./api";
import { Root } from "@/app/page";

export const getData = async (): Promise<AxiosResponse<Root[]>> => {
  try {
    const response = await api<Root[]>({
      method: "GET",
      url: "/data",
    });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
