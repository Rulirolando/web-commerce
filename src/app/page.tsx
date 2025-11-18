// src/app/page.tsx
import Posts from "@/components/postCard";
import { getPost } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignUpButton, SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const posts = await getPost();
  const dbUserId = await getDbUserId();
  const user = await currentUser();
  if (!user) return authUser();

  return (
    <main className="mt-14 flex flex-col items-center gap-y-12 bg-gray-100">
      {posts.map((post) => (
        <section
          key={post.id}
          className="w-full min-h-screen flex justify-center items-center"
        >
          <Posts key={post.id} post={post} dbUserId={dbUserId ?? ""} />
        </section>
      ))}
    </main>
  );
}

function authUser() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton mode="modal">
            <Button className="w-full" variant="outline">
              Login
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <CardDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Button className="w-full mt-2" variant="default">
                Sign Up
              </Button>
            </CardDescription>
          </SignUpButton>
        </CardContent>
      </Card>
    </div>
  );
}
