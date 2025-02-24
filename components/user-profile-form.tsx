"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Session } from "next-auth";

type UserProfileProps = React.HTMLAttributes<HTMLDivElement> & {
  session: Session;
};

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username must be at most 30 characters long." }),
  bio: z
    .string()
    .max(255, { message: "Bio must be at most 255 characters long." }),
  profile_image: z.instanceof(File).refine((file) => file.size < 7000000, {
    message: "Profile image must be less than 7MB.",
  }),
});

// Once we got the session from NextAuth, we can use it to get the user data from our database.
// For now, we'll just use a mock user data.
function getUserData(session: Session) {
  return {
    id: 1,
    name: "Kenneth Quintero",
    bio: "Just write something about yourself.",
    username: session.user?.name || "",
    email: session.user?.email || "",
    profile_image_url: session.user?.image || "avatar.png",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function UserProfileForm({
  session,
  className,
  ...props
}: UserProfileProps) {
  const user = getUserData(session);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile_image: undefined,
      username: user.username,
      bio: user.bio,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}

  // old code

  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [isChanged, setIsChanged] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  useEffect(() => {
    if (username !== user.username || bio !== user.bio || uploadedImage) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [username, bio, user.username, user.bio, uploadedImage]);

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (uploadedImage) {
      formData.append("profilePicture", uploadedImage);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await fetch("/api/save-user-information", {
      method: "POST",
      body: formData,
    });
  };

  const handleLogOut = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });
  };

  return (
    <div
      className={cn(
        "w-full flex justify-center p-4 overflow-y-auto",
        className
      )}
      {...props}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex flex-col items-center gap-5">
            <div id="imageNameUsername" className="flex items-center gap-3">
              <div className="relative">
                <Image
                  className="rounded-full w-min"
                  alt="profilePicture"
                  width={81}
                  height={81}
                  src={user.profile_image_url}
                />
                <button
                  className="absolute -bottom-1 -right-0 bg-white rounded-full py-1 px-2 text-xs shadow text-black hover:bg-gray-200 duration-200"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  Edit
                </button>
                <FormField
                  control={form.control}
                  name="profile_image"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(event) => {
                            onChange(
                              event.target.files && event.target.files[0]
                            );
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <p className="font-bold text-2xl">{user.first_name}</p>
                <div className="flex gap-2 items-center"></div>
                <p className="font-sans italic text-sm">@{user.username}</p>
              </div>
            </div>
          </div>
        </form>
      </Form>
      <div className="flex flex-col items-center justify-centers">
        <div className="flex flex-col items-center gap-5">
          <div id="imageNameUsername" className="flex items-center gap-3">
            <div className="relative">
              <Image
                className="rounded-full w-min"
                alt="profilePicture"
                width={120}
                height={120}
                src={user.profile_image || "/avatar.png"}
              />
              <button
                className="absolute -bottom-1 -right-0 bg-white rounded-full py-1 px-2 text-sm text-black
                                hover:bg-gray-200 duration-200"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                Edit
              </button>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setUploadedImage(file);
                    console.log("Selected file:", file);
                  }
                }}
              />
            </div>
            <div className="w-full">
              <p className="font-bold text-2xl">{user.fullName}</p>
              <div className="flex gap-2 items-center"></div>
              <p className="font-sans italic text-sm">@{user.username}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-col w-full gap-4">
            <div>
              <p>Username</p>
              <input
                className="Input text-black rounded-sm p-1 w-full h-8 text-sm font-extralight"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <p>Bio</p>
              <textarea
                className="text-black rounded-sm p-1 bg-gray-100 w-full text-sm resize-none font-extralight"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 255))}
                maxLength={255}
              ></textarea>
            </div>
            {isChanged && (
              <Button variant="secondary" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-4 w-full mt-2">
            <hr className="w-full border-t border-gray-600" />
            <Button variant="outline" className="w-full" onClick={handleLogOut}>
              Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
