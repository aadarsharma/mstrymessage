import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Unauthorized'
        }, { status: 401 })
    }
    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                error: "User not found"
            }, { status: 404 })
        }
    } catch (error) {
        console.error("Error in get-messages route: ", error);
        return Response.json({
            success: false,
            error: "An error occurred while fetching messages",
        }, { status: 500 })
    }
}