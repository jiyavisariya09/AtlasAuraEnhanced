import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId, serverError, unauthorized } from '@/lib/server/session';
import { parseBody, tripPlanSchema } from '@/lib/server/validation';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ tripPlans: [] });

    const tripPlans = await prisma.tripPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ tripPlans });
  } catch (err) {
    return serverError('TripPlans GET error', err, 'Could not load your trips.');
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return unauthorized();

    const parsed = await parseBody(req, tripPlanSchema);
    if (!parsed.ok) return parsed.response;
    const { title, destination, startDate, endDate, budgetUSD, itineraryDays, checklist } = parsed.data;

    const defaultChecklist = checklist || [
      { id: '1', item: 'Passport & Visa Documentation', category: 'Documents', done: false },
      { id: '2', item: 'Universal Power Adapter & Cables', category: 'Electronics', done: false },
      { id: '3', item: 'Local Currency (Cash in ₹ / Local)', category: 'Money', done: false },
      { id: '4', item: 'Comfortable Walking & Hiking Shoes', category: 'Wardrobe', done: false },
      { id: '5', item: 'Travel Medical Kit & Prescriptions', category: 'Health', done: false },
    ];

    const defaultItinerary = itineraryDays || [
      {
        day: 1,
        title: 'Arrival & Scenic Stroll',
        activities: [
          { time: '11:00 AM', title: 'Hotel Check-in & Refresh', category: 'Stay', costINR: 4500 },
          { time: '02:30 PM', title: 'Historic Old Town Walk & Cafés', category: 'Sightseeing', costINR: 800 },
          { time: '07:30 PM', title: 'Traditional Welcome Dinner', category: 'Dining', costINR: 1800 },
        ],
      },
      {
        day: 2,
        title: 'Heritage & Nature Highlights',
        activities: [
          { time: '09:00 AM', title: 'Guided Architectural Tour', category: 'Sightseeing', costINR: 2200 },
          { time: '01:00 PM', title: 'Local Street Food Tasting', category: 'Dining', costINR: 600 },
          { time: '05:00 PM', title: 'Sunset Viewpoint Photography', category: 'Relaxation', costINR: 0 },
        ],
      },
    ];

    const tripPlan = await prisma.tripPlan.create({
      data: {
        userId,
        title,
        destination,
        startDate: startDate || null,
        endDate: endDate || null,
        budgetUSD: budgetUSD ?? 600,
        itineraryDays: defaultItinerary,
        checklist: defaultChecklist,
      },
    });

    return NextResponse.json({ message: 'Trip plan created successfully', tripPlan }, { status: 201 });
  } catch (err) {
    return serverError('TripPlans POST error', err, 'Could not save that trip.');
  }
}

const updateTripSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().max(120).optional(),
  destination: z.string().trim().max(120).optional(),
  startDate: z.string().trim().max(32).optional().nullable(),
  endDate: z.string().trim().max(32).optional().nullable(),
  budgetUSD: z.coerce.number().min(0).max(10_000_000).optional(),
  itineraryDays: z.array(z.any()).max(120).optional(),
  checklist: z.array(z.any()).max(300).optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return unauthorized();

    const parsed = await parseBody(req, updateTripSchema);
    if (!parsed.ok) return parsed.response;
    const { id, title, destination, startDate, endDate, budgetUSD, itineraryDays, checklist } = parsed.data;

    // IDOR protection: Verify ownership before update
    const existing = await prisma.tripPlan.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Trip not found or permission denied.' }, { status: 404 });
    }

    const updated = await prisma.tripPlan.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(destination !== undefined && { destination }),
        ...(startDate !== undefined && { startDate }),
        ...(endDate !== undefined && { endDate }),
        ...(budgetUSD !== undefined && { budgetUSD }),
        ...(itineraryDays !== undefined && { itineraryDays }),
        ...(checklist !== undefined && { checklist }),
      },
    });

    return NextResponse.json({ message: 'Trip updated successfully', tripPlan: updated });
  } catch (err) {
    return serverError('TripPlans PUT error', err, 'Could not update trip.');
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return unauthorized();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Trip ID is required.' }, { status: 400 });
    }

    // IDOR protection: Ensure user owns this trip
    const existing = await prisma.tripPlan.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Trip not found or permission denied.' }, { status: 404 });
    }

    await prisma.tripPlan.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    return serverError('TripPlans DELETE error', err, 'Could not delete trip.');
  }
}
