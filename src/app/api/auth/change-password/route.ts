import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getUserId, unauthorized, serverError } from '@/lib/server/session';

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { message: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return unauthorized();
      }

      if (user.passwordHash) {
        if (!currentPassword) {
          return NextResponse.json(
            { message: 'Current password is required.' },
            { status: 400 }
          );
        }

        const matches = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!matches) {
          return NextResponse.json(
            { message: 'Incorrect current password.' },
            { status: 400 }
          );
        }
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
      });

      return NextResponse.json({ ok: true, message: 'Password updated successfully.' });
    }

    // Demo/Local session support
    return NextResponse.json({ ok: true, message: 'Password updated successfully for current session.' });
  } catch (err) {
    return serverError('auth:change-password', err, 'Failed to update password.');
  }
}
