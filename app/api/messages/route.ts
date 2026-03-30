import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "messages.json");

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
  }
};

// GET all messages
export async function GET(request: NextRequest) {
  try {
    ensureDataDir();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const data = fs.readFileSync(dataFilePath, "utf8");
    let messages = JSON.parse(data);

    if (status) {
      messages = messages.filter((msg: any) => msg.status === status);
    }

    // Sort by date descending
    messages.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

// POST new message
export async function POST(request: NextRequest) {
  try {
    ensureDataDir();
    const body = await request.json();
    const data = fs.readFileSync(dataFilePath, "utf8");
    const messages = JSON.parse(data);

    const newMessage = {
      id:
        messages.length > 0
          ? Math.max(...messages.map((m: any) => m.id)) + 1
          : 1,
      ...body,
      status: "unread",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2));

    return NextResponse.json(
      { success: true, message: newMessage },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create message" },
      { status: 500 },
    );
  }
}

// PUT update message status
export async function PUT(request: NextRequest) {
  try {
    ensureDataDir();
    const body = await request.json();
    const { id, status } = body;

    const data = fs.readFileSync(dataFilePath, "utf8");
    const messages = JSON.parse(data);

    const index = messages.findIndex((m: any) => m.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Message not found" },
        { status: 404 },
      );
    }

    messages[index] = {
      ...messages[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2));

    return NextResponse.json({ success: true, message: messages[index] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update message" },
      { status: 500 },
    );
  }
}

// DELETE message
export async function DELETE(request: NextRequest) {
  try {
    ensureDataDir();
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    const data = fs.readFileSync(dataFilePath, "utf8");
    const messages = JSON.parse(data);

    const index = messages.findIndex((m: any) => m.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Message not found" },
        { status: 404 },
      );
    }

    messages.splice(index, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2));

    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
