// app/api/tracker/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Tracker from "../../../models/tracker";

type Click = {
  element: string;
  coordinates: { x: number; y: number };
  timestamp: number;
};

type Activity = {
  type: string;
  timestamp: number;
  data: {
    path?: string;
    duration?: number;
    action?: string;
  };
};

export async function POST(req: NextRequest) {
  console.log("📥 Received analytics request");

  await connect();
  console.log("🔌 Database connected");

  try {
    const data = await req.json();
    console.log("📦 Parsed analytics data:", data);

    if (!Array.isArray(data)) {
      throw new Error("Data must be an array of events");
    }

    // Group events by sessionId and page
    const eventsBySession = data.reduce(
      (acc, event) => {
        const key = `${event.sessionId}-${event.page}`;
        if (!acc[key]) {
          acc[key] = {
            sessionId: event.sessionId,
            page: event.page,
            startTime: event.type === "init" ? event.timestamp : null,
            duration: event.type === "init" ? event.duration || 0 : 0,
            clicks: [],
            activities: [],
          };
        }

        if (event.type === "click") {
          acc[key].clicks.push({
            x: event.x,
            y: event.y,
            timestamp: event.timestamp,
          });
        } else if (event.type === "activity") {
          acc[key].activities.push({
            activityType: "user_interaction",
            timestamp: event.timestamp,
          });
        } else if (event.type === "init") {
          acc[key].startTime = event.timestamp;
          acc[key].duration = event.duration || 0;
        }

        return acc;
      },
      {} as Record<
        string,
        {
          sessionId: string;
          page: string;
          startTime: number | null;
          duration: number;
          clicks: Click[];
          activities: Activity[];
        }
      >
    );

    // Upsert each session-page document
    const upsertPromises = Object.values(eventsBySession).map(
      async (sessionData: unknown) => {
        const typedSessionData = sessionData as {
          sessionId: string;
          page: string;
          startTime: number | null;
          duration: number;
          clicks: Click[];
          activities: Activity[];
        };

        if (!typedSessionData.startTime) {
          // If no init event, use the earliest timestamp as startTime
          const timestamps = [
            ...typedSessionData.clicks.map(
              (c: { timestamp: number }) => c.timestamp
            ),
            ...typedSessionData.activities.map(
              (a: { timestamp: number }) => a.timestamp
            ),
          ];
          typedSessionData.startTime =
            timestamps.length > 0 ? Math.min(...timestamps) : Date.now();
        }

        const update = {
          $set: {
            startTime: typedSessionData.startTime,
            duration: typedSessionData.duration,
          },
          $push: {
            clicks: { $each: typedSessionData.clicks },
            activities: { $each: typedSessionData.activities },
          },
        };

        const result = await Tracker.findOneAndUpdate(
          {
            sessionId: typedSessionData.sessionId,
            page: typedSessionData.page,
          },
          update,
          { upsert: true, new: true }
        );
        return result;
      }
    );

    const updatedDocs = await Promise.all(upsertPromises);
    console.log(
      "💾 Analytics saved successfully:",
      updatedDocs.length,
      "sessions updated"
    );

    return NextResponse.json(
      {
        message: "Events saved",
        sessionIds: updatedDocs.map((doc) => doc._id),
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("❌ Error saving analytics:", error);
    return NextResponse.json(
      {
        error: "Failed to save events",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log("📥 Received analytics request");
  await connect();
  console.log("🔌 Database connected");

  try {
    const events = await Tracker.find();
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.log("❌ Error retrieving analytics:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve events",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
