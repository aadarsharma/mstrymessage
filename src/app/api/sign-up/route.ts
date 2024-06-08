import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    const { username, email, password } = await request.json();

    await dbConnect();

    try {
        const existingUserVerifiedByUsername = await User.findOne({
            username,
            isVerified: true
        });
        if(existingUserVerifiedByUsername) {
            return Response.json({
                status: 400,
                success: false,
                message: "Username already exists",
            });
        }
    } catch (error) {
        console.error("Error checking if user exists:", error);
        return Response.json({
            status: 500,
            success: false,
            message: "Error registering user",
        });
    }
}