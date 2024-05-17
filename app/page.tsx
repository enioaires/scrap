import axios from "axios";
import { Client } from "./client";

export default async function Home() {
  const comments = await axios.get<string[]>(
    "https://scrap-pearl.vercel.app/api"
  );

  return <>{comments.data && <Client comments={comments.data} />}</>;
}
