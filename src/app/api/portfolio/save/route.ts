import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'; // Assuming direct client usage if db helper is complex
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../auth/[...nextauth]/route'; // Adjusted path to new authOptions

// Ensure PrismaClient is initialized, possibly from a shared lib/db.ts file in a real app
// For consistency with the auth route, if it uses `import { db } from "../../../../lib/db";`,
// this should ideally use the same `db` instance.
// However, the prompt used `new PrismaClient()` here previously. I'll switch to the shared instance if possible.
// Let's assume `prisma` is available via a lib, or use new PrismaClient() if not set up that way.
// For now, sticking to new PrismaClient() as per original structure of this file.
// If `import prisma from '@/lib/db'` was intended, it should be:
// import prisma from '@/lib/db'; // This requires tsconfig paths setup or relative path.
                               // Using relative path for now if no tsconfig paths.
import { db as prisma } from '../../../../lib/db'; // Corrected import to use shared 'db' instance

// Define a type for the expected request body structure
// This should align with src/types/portfolio.ts but might need adjustments for Prisma (e.g. Json fields)
interface PortfolioSaveRequestBody {
  userInfo: any; // Should be UserInfo from src/types/portfolio
  socialLinks: any[]; // Should be SocialLink[] from src/types/portfolio
  projects: any[]; // Should be Project[] from src/types/portfolio
  themeId?: string;
  layoutId?: string;
  customCss?: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Please log in.' }, { status: 401 });
  }
  const authenticatedUserId = (session.user as any).id;

  try {
    const body = (await req.json()) as PortfolioSaveRequestBody;

    const {
      userInfo,
      socialLinks,
      projects,
      themeId = 'default',
      layoutId = 'standard',
      customCss,
    } = body;

    // Validate required fields (basic validation)
    if (!userInfo || !socialLinks || !projects) {
      return NextResponse.json(
        { success: false, error: 'Missing required portfolio data.' },
        { status: 400 }
      );
    }

    // Data is already Json[] in Prisma schema now (PostgreSQL), Prisma handles serialization.
    const portfolioData = {
      userId: authenticatedUserId,
      userInfo: userInfo,
      socialLinks: socialLinks,
      projects: projects,
      themeId: themeId,
      layoutId: layoutId,
      customCss: customCss,
    };

    const savedPortfolio = await prisma.portfolio.upsert({
      where: { userId: authenticatedUserId },
      create: {
        ...portfolioData,
        // Ensure relations or other non-Json fields are correctly handled if needed
        // For example, user: { connect: { id: authenticatedUserId } } is implicit in upsert by userId
      },
      update: {
        userInfo: userInfo,
        socialLinks: socialLinks,
        projects: projects,
        themeId: themeId,
        layoutId: layoutId,
        customCss: customCss,
        lastUpdatedAt: new Date(), // Prisma @updatedAt handles this automatically
      },
    });

    return NextResponse.json({ success: true, data: savedPortfolio }, { status: 200 });
  } catch (error) {
    console.error('Error saving portfolio:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json(
      { success: false, error: 'Failed to save portfolio data.', details: errorMessage },
      { status: 500 }
    );
  }
}
