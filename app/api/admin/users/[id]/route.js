import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import User from "@/app/Models/User";
import Interview from "@/models/Interview";

export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    
    const { id } = params;
    
    // Delete user's interviews first
    await Interview.deleteMany({ userId: id });
    
    // Delete the user
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}