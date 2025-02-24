"use client";

// import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { UserProfileForm } from "@/components/user-profile-form";
import { useSession } from "next-auth/react";

const ProfilePage: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="border-2 rounded-lg">
        {session && <UserProfileForm session={session} />}
      </div>
    </div>
  );
};

export default ProfilePage;
