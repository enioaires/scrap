import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

type LatestComment = {
  id: string;
  text: string;
  ownerUsername: string;
  ownerProfilePicUrl: string;
  timestamp: string;
  likesCount: number;
};

type Comment = {
  latestComments: LatestComment[];
  url: string;
};

export default async function Home() {
  const comments = await axios.get<string[]>(
    "https://scrap-pearl.vercel.app/api"
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ScrollArea>
        <div className="space-y-2">
          {comments.data.map((comment, index) => (
            <div key={index} className="p-4 bg-gray-700 rounded-md">
              {comment}
            </div>
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}
