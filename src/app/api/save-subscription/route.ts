/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SUBS_FILE = path.resolve(process.cwd(), 'subscriptions.json');

export async function POST(req: NextRequest) {
  try {
    const { subscription, userId } = await req.json();
    if (!subscription || !userId) {
      return NextResponse.json({ error: 'Missing subscription or userId' }, { status: 400 });
    }
    let data: any[] = [];
    try {
      const file = await fs.readFile(SUBS_FILE, 'utf-8');
      data = JSON.parse(file);
    } catch (e) {
      // file có thể chưa tồn tại, bỏ qua
    }
    // Kiểm tra trùng userId + endpoint
    const exists = data.find(
      (item) => item.userId === userId && item.subscription?.endpoint === subscription.endpoint
    );
    if (!exists) {
      data.push({ userId, subscription, createdAt: new Date().toISOString() });
      await fs.writeFile(SUBS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', detail: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, endpoint } = await req.json();
    if (!userId || !endpoint) {
      return NextResponse.json({ error: 'Missing userId or endpoint' }, { status: 400 });
    }
    let data: any[] = [];
    try {
      const file = await fs.readFile(SUBS_FILE, 'utf-8');
      data = JSON.parse(file);
    } catch (e) {
      // file có thể chưa tồn tại, bỏ qua
    }
    const newData = data.filter(
      (item) => !(item.userId === userId && item.subscription?.endpoint === endpoint)
    );
    await fs.writeFile(SUBS_FILE, JSON.stringify(newData, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', detail: String(err) }, { status: 500 });
  }
}
