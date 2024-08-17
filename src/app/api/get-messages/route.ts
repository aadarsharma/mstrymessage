import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

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
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: '$messages'     
            },
            {
                $sort: {
                    'messages.createdAt': -1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: {
                        $push: '$messages'
                    }
                }
            }
        ])
        if(!user || !user.length) {
            return Response.json({
                success: false,
                error: "User not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 })
    }
    catch (error) {
        console.error("Error in get-messages route: ", error);
        return Response.json({
            success: false,
            error: "An error occurred while fetching the messages",
        }, { status: 500 })
    }
}