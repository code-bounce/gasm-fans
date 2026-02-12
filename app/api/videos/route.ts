import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "10");
    const search = searchParams.get("search") || "";
    const modelId = searchParams.get("modelId");

    const where: any = {
      title: {
        contains: search,
        mode: "insensitive",
      },
    };

    if (modelId) {
      where.models = {
        some: {
          id: modelId,
        },
      };
    }

    const videos = await prisma.video.findMany({
      where,
      include: {
        models: true,
      },
      skip,
      take,
      orderBy: {
        uploadedAt: "desc",
      },
    });

    const total = await prisma.video.count({ where });

    return NextResponse.json({
      data: videos,
      total,
      skip,
      take,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      url,
      previewUrl,
      thumbnail,
      duration,
      views,
      modelIds,
    } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 },
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || null,
        url,
        previewUrl: previewUrl || null,
        thumbnail: thumbnail || null,
        duration: duration ? String(duration) : null,
        views: views ? parseInt(views) : 0,
        models: {
          connect: modelIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        models: true,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      {
        error: "Failed to create video",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
