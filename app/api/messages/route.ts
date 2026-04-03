import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import Message from "@/models/Message";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const MESSAGE_STATUSES = new Set(["unread", "read"]);

function clampStr(str: unknown, maxLen: number): string {
  return String(str || "").slice(0, maxLen).trim();
}

function parseIntSafely(val: unknown, fallback: number): number {
  const num = Number(val);
  return Number.isFinite(num) ? Math.floor(num) : fallback;
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query = status && MESSAGE_STATUSES.has(status) ? { status } : {};
    const messages = await Message.find(query).sort({ createdAt: -1 }).lean();

    const plainMessages = messages.map((m) => ({
      ...m,
      _id: m._id.toString(),
      createdAt: m.createdAt?.toISOString(),
      updatedAt: m.updatedAt?.toISOString(),
    }));

    return NextResponse.json({ success: true, messages: plainMessages });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const name = clampStr(body.name, 120);
    const email = clampStr(body.email, 254);
    const subject = clampStr(body.subject, 200);
    const message = clampStr(body.message, 8000);

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "Name, email, subject, and message are required" }, { status: 400 });
    }

    const created = await Message.create({
      name,
      email,
      subject,
      message,
      status: "unread",
    });

    const plain = {
      ...created.toObject(),
      _id: created._id.toString(),
      createdAt: created.createdAt?.toISOString(),
      updatedAt: created.updatedAt?.toISOString(),
    };

    return NextResponse.json({ success: true, message: plain }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create message" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    const id = String(body.id || "").trim();
    const status = String(body.status || "").trim();

    if (!id || !MESSAGE_STATUSES.has(status)) {
      return NextResponse.json({ success: false, error: "Valid message id and status are required" }, { status: 400 });
    }

    const updated = await Message.findByIdAndUpdate(id, { status }, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 });
    }

    const plain = {
      ...updated,
      _id: updated._id.toString(),
      createdAt: updated.createdAt?.toISOString(),
      updatedAt: updated.updatedAt?.toISOString(),
    };

    return NextResponse.json({ success: true, message: plain });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";

    if (!id) {
      return NextResponse.json({ success: false, error: "Valid message id is required" }, { status: 400 });
    }

    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete message" }, { status: 500 });
  }
}