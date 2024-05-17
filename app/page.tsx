import { Client } from "./client";
import { getData } from "@/services/getData";

export interface Root {
  url: string;
  latestComments: LatestComment[];
}

export interface LatestComment {
  text: string;
  timestamp: string;
}

export default async function Home() {
  return <Client />;
}
