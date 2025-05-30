import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client'; // No longer using new PrismaClient()
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../auth/[...nextauth]/route'; // Adjusted path
import { db as prisma } from '../../../../lib/db'; // Corrected import

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Please log in.' }, { status: 401 });
  }
  const authenticatedUserId = (session.user as any).id;

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
