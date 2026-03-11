import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_API = "https://api.telegram.org";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!botToken || !chatId) {
      console.error("[Contact] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
      return NextResponse.json(
        { error: "Contact form is not configured" },
        { status: 500 }
      );
    }

    const text = [
      "📬 Новое сообщение с сайта",
      "",
      `👤 Имя: ${name}`,
      `📧 Email: ${email}`,
      "",
      "💬 Сообщение:",
      message,
    ].join("\n");

    const url = `${TELEGRAM_API}/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Contact] Telegram API error:", err);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contact] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
