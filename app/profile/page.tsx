'use client';

import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
// import { SignOutButton } from '@/components/sign-out-button';

export default function ProfilePage() {
  const { session, loading } = useAuth();

  return (
    <div className="flex h-screen w-full justify-center">
      <div>
        <div className="mt-5 flex gap-3">
          <Button variant="link">
            <Link href="/">Home</Link>
          </Button>
          <Button variant="link">
            <Link href="/explore">Explore</Link>
          </Button>
        </div>
        <Separator />
        {loading && <span>Loading...</span>}
        {session && (
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session.user.user_metadata.picture} alt="User picture" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xl font-semibold">Kenneth Quintero</p>
                  <p className="text-sm text-muted-foreground">
                    @{session.user.user_metadata.full_name}
                  </p>
                </div>
              </div>
              <Button disabled variant="outline">
                <Pencil className="scale-90" />
                <span>Edit</span>
              </Button>
            </div>
            <Separator />
            <div className="flex justify-end">{/* <SignOutButton /> */}</div>
            <div>
              <h2 className="text-muted-foreground">📊 Statistics</h2>
              <div className="coming-soon">
                <div className="content mt-5 grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="tracking-light text-ms font-normal">
                        📍 Locations Visited
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">13</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="tracking-light text-ms font-normal">
                        🗺️ Locations Contributed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">7</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="tracking-light text-ms font-normal">
                        💬 Locations Reviewed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">4</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
