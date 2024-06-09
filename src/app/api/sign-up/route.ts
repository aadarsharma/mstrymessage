import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";

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
        const exisitngUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(exisitngUserByEmail) {
            if(exisitngUserByEmail.isVerified) {
                return Response.json({
                    status: 400,
                    success: false,
                    message: "Email already exists",
                });
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                exisitngUserByEmail.password = hashedPassword;
                exisitngUserByEmail.verifyCode = verifyCode;
                exisitngUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await exisitngUserByEmail.save();
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })
            await newUser.save();
        };
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if(emailResponse.success) {
            return Response.json({
                status: 200,
                success: true,
                message: "Verification email sent",
            });
        }
        else {
            return Response.json({
                status: 500,
                success: false,
                message: "Error sending verification email",
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