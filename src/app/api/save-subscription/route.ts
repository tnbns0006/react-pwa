/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { subscription, userId } = await req.json();
    if (!subscription || !userId) {
      return NextResponse.json({ error: 'Missing subscription or userId' }, { status: 400 });
    }
    // Lưu hoặc cập nhật subscription
    await prisma.subscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: { userId, data: subscription },
      create: { userId, endpoint: subscription.endpoint, data: subscription },
    });
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
    await prisma.subscription.deleteMany({ where: { userId, endpoint } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', detail: String(err) }, { status: 500 });
  }
}
