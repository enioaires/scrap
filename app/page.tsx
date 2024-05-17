import axios from "axios";
import { Client } from "./client";

export interface Root {
  url: string;
  latestComments: LatestComment[];
}

export interface LatestComment {
  text: string;
  timestamp: string;
}

export default async function Home() {
  const comments = await axios.get<Root[]>(
    "https://scrap-pearl.vercel.app/api"
  );

  return <>{comments.data && <Client comments={comments.data} />}</>;
}
