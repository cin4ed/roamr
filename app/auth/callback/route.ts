import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export type AuthError = {
  error_code: string;
  error_description: string;
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/explore';

  console.log(searchParams);

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/error?error_code=missing_code&error_description=Missing code`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Error exchanging code for session:', error);

    // Encode the error message to ensure it's URL-safe
    const errorMessage = encodeURIComponent(error.message || 'Unknown error');
    const errorCode = encodeURIComponent(error.code || 'unknown_error_code');

    // Redirect to error page with error information
    return NextResponse.redirect(
      `${origin}/auth/error?error_code=${errorCode}&error_description=${errorMessage}`
    );
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}
