import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import User from "@/app/Models/User";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    await connectToDB();
    
    const adminEmail = "askupteam396@gmail.com";
    const adminPassword = "askup@12345";
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" });
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const adminUser = await User.create({
      name: "AskUp Admin",
      email: adminEmail,
      password: hashedPassword
    });
    
    return NextResponse.json({ 
      message: "Admin user created successfully",
      email: adminEmail,
      password: adminPassword
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}