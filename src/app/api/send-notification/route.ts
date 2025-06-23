/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import webpush from 'web-push';

const SUBS_FILE = path.resolve(process.cwd(), 'subscriptions.json');

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
    let data: any[] = [];
    try {
      const file = await fs.readFile(SUBS_FILE, 'utf-8');
      data = JSON.parse(file);
    } catch (e) {
      // file có thể chưa tồn tại
    }
    const targets = data.filter((item) => item.userId !== senderId);
    const payload = JSON.stringify({
      title: `Message from ${senderId}`,
      body: message,
      icon: '/icon-192x192.png',
    });
    const results = [];
    for (const target of targets) {
      try {
        await webpush.sendNotification(target.subscription, payload);
        results.push({ userId: target.userId, success: true });
      } catch (err) {
        results.push({ userId: target.userId, success: false, error: String(err) });
      }
    }
    return NextResponse.json({ success: true, sent: results.length, results });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', detail: String(err) }, { status: 500 });
  }
}
