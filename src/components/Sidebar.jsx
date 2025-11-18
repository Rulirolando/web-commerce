import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
export default async function Sidebar() {
  const authUser = await currentUser();

  if (!authUser) return null;

  const user = await getUserByClerkId(authUser.id);

  if (!user) return null;

  return (
    <>
      <div className="sticky">
        <Card></Card>
      </div>
    </>
  );
}
