import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
const express = require('express'); 
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/askup_virtual_interview')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// GET: Get all users
export async function GET() {
  await connectToDatabase();
  const users = await User.find({}, { password: 0 }); // exclude password
  return new Response(JSON.stringify(users), { status: 200 });
}

// POST: Register new user
export async function POST(req) {
  const { name, email, password } = await req.json();
  await connectToDatabase();

  const existingUser = await User.findOne({ email });
  if (existingUser) return new Response(JSON.stringify({ error: "User exists" }), { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  return new Response(JSON.stringify({ message: "User created", user: { name, email } }), { status: 201 });
}

// PATCH: Update user
export async function PATCH(req) {
  const { userId, name, email, password } = await req.json();
  await connectToDatabase();

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 10);

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, fields: { password: 0 } });
  if (!updatedUser) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

  return new Response(JSON.stringify(updatedUser), { status: 200 });
}

// DELETE: Delete user
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  await connectToDatabase();

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

  return new Response(JSON.stringify({ message: "User deleted" }), { status: 200 });
}
