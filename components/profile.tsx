"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "./ui/button";
import type { UserInformation } from '@/data/user-information';

const Profile: React.FC<{ user: UserInformation }> = ({ user }) => {
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
        formData.append('username', username);
        formData.append('bio', bio);
        if (uploadedImage) {
            formData.append('profilePicture', uploadedImage);
        }

        const response = await fetch('/api/save-user-information', {
            method: 'POST',
            body: formData,
        });
    };

    const handleLogOut = async () => {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
        });
    };

    return (
        <div className="w-full flex justify-center p-4 overflow-y-auto">
            <div className="flex flex-col items-center justify-centers">
                <div className="flex flex-col items-center gap-5">
                    <div 
                        id="imageNameUsername"
                        className="flex items-center gap-3"
                    >
                        <div className="relative">
                            <Image 
                                className="rounded-full w-min"
                                alt="profilePicture"
                                width={120}
                                height={120}
                                src={user.profilePicture} 
                            />
                            <button 
                                className="absolute -bottom-1 -right-0 bg-white rounded-full py-1 px-2 text-sm text-black
                                hover:bg-gray-200 duration-200"
                                onClick={() => document.getElementById('fileInput')?.click()}
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
                                        console.log('Selected file:', file);
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
                        {isChanged && <Button variant="secondary" onClick={handleSaveChanges}>Save Changes</Button>}
                    </div>
                    <div className="flex flex-col gap-4 w-full mt-2">
                        <hr className="w-full border-t border-gray-600" />
                        <Button variant="outline" className="w-full" onClick={handleLogOut}>Log out</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;