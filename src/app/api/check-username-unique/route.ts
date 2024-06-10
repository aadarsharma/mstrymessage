import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET( request: Request ) {
    await dbConnect();
    // localhost:3000/api/check-username-unique?username=example
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username"),
        }
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result); // TODO: Remove this line
        if(!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: "Invalid username",
            }, {status: 400});
        }
        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if(existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken",
            }, {status: 400});
        }
        return Response.json({
            success: true,
            message: "Username is unique",
        }, {status: 400});
    }
    catch(error) {
        console.error("Error in check-username-unique route: ", error);
        return Response.json({
            success: false,
            error: "An error occurred while checking the username",
        })
    }
}