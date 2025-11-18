import { currentUser } from "@clerk/nextjs/server";
import CreatePost from "@/components/CreatePost";
export default async function JualPage() {
  const user = await currentUser();
  return user ? <CreatePost /> : null;
}
