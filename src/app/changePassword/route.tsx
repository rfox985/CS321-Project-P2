import { redirect } from "next/navigation";

export async function GET(request: Request) {
    // Get the search param with the token, then send to changePasswordForm on website
    const token = new URL(request.url).searchParams.get("token");
    redirect(`/?form=changePassword&token=${token}`);
}

export async function POST(request: Request) {
    GET(request);
}