import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                error: "User not found"
            }, { status: 404 })
        }
        if(!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                error: "User is not accepting messages"
            }, { status: 400 })
        }
        const newMessage = {content, createdAt: new Date()};
    }
    catch (error) {
        console.error("Error in send-message route: ", error);
        return Response.json({
            success: false,
            error: "An error occurred while sending the message",
        }, { status: 500 })
    }
}