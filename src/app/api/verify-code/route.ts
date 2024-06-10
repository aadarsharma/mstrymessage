import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

export async function POST( request: Request ) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel
            .findOne({ username: decodedUsername })
        if(!user) {
            return Response.json({
                success: false,
                error: "User not found",
            }, {status: 404});
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date() < new Date(user.verifyCodeExpiry);
        if(isCodeValid && isCodeExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verified successfully",
            }, {status: 200});
        }
        else if(!isCodeExpired) {
            return Response.json({
                success: false,
                error: "Code expired",
            }, {status: 400});
        }
        else {
            return Response.json({
                success: false,
                error: "Invalid code",
            }, {status: 400});
        }
    } catch(error) {
        console.error("Error in verify-code route: ", error);
        return Response.json({
            success: false,
            error: "An error occurred while verifying the code",
        })
    }
}
