import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "12");
    const search = searchParams.get("search") || "";
    const ethnicity = searchParams.get("ethnicity");

    const where: any = {
      name: {
        contains: search,
        mode: "insensitive",
      },
    };

    if (ethnicity) {
      where.ethnicity = ethnicity;
    }

    const models = await prisma.model.findMany({
      where,
      include: {
        videos: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.model.count({
      where,
    });

    return NextResponse.json({
      data: models,
      total,
      skip,
      take,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, ethnicity, gender, image, bio, dateOfBirth, measurements } =
      body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const model = await prisma.model.create({
      data: {
        name,
        ethnicity,
        gender,
        image,
        bio,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        measurements,
      },
      include: {
        videos: true,
      },
    });

    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    console.error("Error creating model:", error);
    return NextResponse.json(
      { error: "Failed to create model" },
      { status: 500 },
    );
  }
}
