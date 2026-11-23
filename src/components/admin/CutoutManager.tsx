"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setBikeCutout } from "@/app/admin/(panel)/stock/bike-actions";

/** Upload a PNG/WebP of the bike with no background, used on the home page hero and showroom tiles. */
export function CutoutManager({
  bikeId,
  url,
}: {
  bikeId: string;
  url: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [pending, start] = useTransition();

  async function onFile(file?: File) {
    if (!file) return;
    if (!["image/png", "image/webp"].includes(file.type))
      return setBusy("Use a PNG or WebP with a transparent background.");
    setBusy("Uploading…");
    try {
      const blob = await upload(
        `bikes/${bikeId}/cutout/${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`,
        file,
        { access: "public", handleUploadUrl: "/api/admin/upload" },
      );
      await setBikeCutout(bikeId, blob.url);
      setBusy("");
      router.refresh();
    } catch (e) {
      setBusy(e instanceof Error ? e.message : "Upload failed");
    }
  }

  return (
    <section className="adm-card adm-sec">
      <div className="adm-sec-head">
        <div>
          <h2>Cut-out (no background)</h2>
          <p className="adm-muted">
            Shown on the home page hero and showroom tiles. PNG or WebP with a
            transparent background, side view.
          </p>
        </div>
        <label className="adm-btn adm-btn-sm">
          {busy || (url ? "Replace" : "+ Upload cut-out")}
          <input
            type="file"
            accept="image/png,image/webp"
            hidden
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      </div>
      {url ? (
        <div className="adm-cutout">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" />
          <button
            type="button"
            className="adm-link-btn dark"
            disabled={pending}
            onClick={() =>
              start(async () => {
                await setBikeCutout(bikeId, null);
                router.refresh();
              })
            }
          >
            Remove
          </button>
        </div>
      ) : (
        <p className="adm-muted" style={{ margin: 0 }}>
          None yet. Without one, the home page uses the first photo.
        </p>
      )}
    </section>
  );
}
