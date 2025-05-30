import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { getServerSession } from "next-auth/next"; // Placeholder for auth
// import { authOptions } from "@/lib/auth"; // Placeholder for auth options

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // TODO: Replace with actual authentication to get userId
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user || !session.user.id) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }
  // const authenticatedUserId = session.user.id;
  const authenticatedUserId = 'user_placeholder_123abc'; // Hardcoded for now, consistent with save route

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: authenticatedUserId },
    });

    if (portfolio) {
      // Prisma automatically deserializes Json fields (userInfo, socialLinks, projects)
      // from strings (in DB for SQLite) to JS objects/arrays when fetching.
      return NextResponse.json({ success: true, data: portfolio });
    } else {
      return NextResponse.json(
        { success: false, message: 'Portfolio not found for this user.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error loading portfolio:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: 'Failed to load portfolio data.', details: errorMessage },
      { status: 500 }
    );
  }
}
