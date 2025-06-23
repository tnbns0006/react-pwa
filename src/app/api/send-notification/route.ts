import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import webpush from 'web-push';
import type { PushSubscription } from 'web-push';

const prisma = new PrismaClient();

// Lấy VAPID keys từ biến môi trường
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  'mailto:admin@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export async function POST(req: NextRequest) {
  try {
    const { senderId, title, message } = await req.json();
    if (!senderId || !title || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    // Lấy danh sách subscription từ DB, loại trừ sender
    const targets = await prisma.subscription.findMany({
      where: { NOT: { userId: senderId } },
    });
    const payload = JSON.stringify({
      title: `Message from ${senderId}`,
      body: message,
      icon: '/icon-192x192.png',
    });
    const results = [];
    for (const target of targets) {
      try {
        const sub = target.data as PushSubscription;
        if (sub && sub.endpoint) {
          await webpush.sendNotification(sub, payload);
          results.push({ userId: target.userId, success: true });
        } else {
          results.push({ userId: target.userId, success: false, error: 'Invalid subscription data' });
        }
      } catch (err) {
        results.push({ userId: target.userId, success: false, error: String(err) });
      }
    }
    return NextResponse.json({ success: true, sent: results.length, results });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', detail: String(err) }, { status: 500 });
  }
}
