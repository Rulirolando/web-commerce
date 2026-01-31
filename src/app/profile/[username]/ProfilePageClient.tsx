"use client";

import { getUserPosts, getProfileByUsername } from "@/actions/profile.action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTextIcon } from "lucide-react";
import Post from "@/components/postCard";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;

interface ProfilePageClientProps {
  user: NonNullable<User>;
  posts: Posts;
}

function ProfilePageClient({ posts, user }: ProfilePageClientProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 overflow-x-hidden">
      <div className="grid grid-cols-1 gap-6">
        {/* Profil User */}
        <div className="w-full max-w-lg mx-auto mt-20">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.img ?? "/avatar.png"} />
                </Avatar>
                <h1 className="mt-4 text-2xl font-bold">
                  {user.name === "Anonymous" ? user.username : user.name}
                </h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Post */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 font-semibold"
            >
              <FileTextIcon className="size-4" />
              Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6 ">
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Post key={post.id} post={post} dbUserId={user.id ?? ""} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada postingan
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProfilePageClient;
