import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { isAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { clampStr, parsePositiveInt } from "@/lib/sanitize";
import { messageToJson } from "@/lib/serialize-db";

export const dynamic = "force-dynamic";

const MESSAGE_STATUSES = new Set(["unread", "read"]);

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const messages = await prisma.message.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      messages: messages.map(messageToJson),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const name = clampStr(body.name, 120);
    const email = clampStr(body.email, 254);
    const subject = clampStr(body.subject, 200);
    const message = clampStr(body.message, 8000);

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, subject, and message are required" },
        { status: 400 },
      );
    }

    const created = await prisma.message.create({
      data: {
        name,
        email,
        subject,
        message,
        status: "unread",
      },
    });

    return NextResponse.json(
      { success: true, message: messageToJson(created) },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create message" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    let body: { id?: unknown; status?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const id = parsePositiveInt(body.id, -1);
    const status = String(body.status ?? "");
    if (id < 1 || !MESSAGE_STATUSES.has(status)) {
      return NextResponse.json(
        { success: false, error: "Valid message id and status are required" },
        { status: 400 },
      );
    }

    try {
      const updated = await prisma.message.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({
        success: true,
        message: messageToJson(updated),
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Message not found" },
          { status: 404 },
        );
      }
      throw e;
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update message" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0", 10);
    if (!Number.isFinite(id) || id < 1) {
      return NextResponse.json(
        { success: false, error: "Valid message id is required" },
        { status: 400 },
      );
    }

    try {
      await prisma.message.delete({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Message not found" },
          { status: 404 },
        );
      }
      throw e;
    }

    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
