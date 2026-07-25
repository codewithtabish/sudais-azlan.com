"use client";

import { updateLastSeen } from "@/app/actions/(users)/update-user";
import { useEffect, useRef } from "react";

export function LastSeenTracker() {
  const lastUpdate = useRef(0);

  useEffect(() => {
    const update = async () => {
      const now = Date.now();

      // Only update every 2 minutes
      if (now - lastUpdate.current < 2 * 60 * 1000) return;

      lastUpdate.current = now;
      await updateLastSeen();
    };

    // Update immediately
    update();

    const events = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
      "visibilitychange",
    ];

    events.forEach((event) =>
      window.addEventListener(event, update, { passive: true })
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, update)
      );
    };
  }, []);

  return null;
}