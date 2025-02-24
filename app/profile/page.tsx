import React from 'react';
import { NextPage } from 'next';
import Profile from "../../components/profile";
import { userInformation } from "@/data/user-information";

const ProfilePage: NextPage = () => {

    return (
        <div className="w-full flex justify-center items-center h-screen">
            <div className="border-2 rounded-lg">
                <Profile user={userInformation} />
            </div>
        </div>
    );
};

export default ProfilePage;
