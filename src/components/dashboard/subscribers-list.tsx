"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Users, Download } from "lucide-react";
import type { Subscriber } from "@/types/database";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SubscribersList({
  initialSubscribers,
  userId,
}: {
  initialSubscribers: Subscriber[];
  userId: string;
}) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const supabase = createClient();
  const router = useRouter();

  async function handleDelete(id: string) {
    const { error } = await supabase.from("subscribers").delete().eq("id", id);
    if (error) {
      toast.error("Failed to remove subscriber");
      return;
    }
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    toast.success("Subscriber removed");
    router.refresh();
  }

  function handleExportCsv() {
    if (subscribers.length === 0) return;
    const csv = ["email,subscribed_at"]
      .concat(subscribers.map((s) => `${s.email},${s.subscribed_at}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {subscribers.length} {subscribers.length === 1 ? "subscriber" : "subscribers"}
        </CardTitle>
        {subscribers.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">No subscribers yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Enable the email signup form in Settings to start collecting subscribers.
            </p>
          </div>
        ) : (
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(sub.subscribed_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sub.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
