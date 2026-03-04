"use client";

import { useRef } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export function QrCodeCard({
  username,
  accentColor,
}: {
  username: string;
  accentColor: string;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${username}`;

  function handleDownload() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) {
      toast.error("Could not generate QR code");
      return;
    }
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${username}-qr.png`;
    a.click();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">QR Code</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Share your profile with a scannable QR code.
      </p>

      <div className="mt-4 flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6">
        <div className="rounded-lg bg-white p-3">
          <QRCodeSVG
            value={profileUrl}
            size={180}
            fgColor={accentColor}
            bgColor="#ffffff"
            level="M"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {profileUrl}
        </p>

        <Button variant="outline" className="gap-2" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download PNG
        </Button>

        {/* Hidden high-res canvas for download */}
        <div ref={canvasRef} className="hidden">
          <QRCodeCanvas
            value={profileUrl}
            size={512}
            fgColor={accentColor}
            bgColor="#ffffff"
            level="M"
          />
        </div>
      </div>
    </div>
  );
}
