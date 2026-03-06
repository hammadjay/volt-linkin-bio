"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Gift, Users, Crown, UserPlus, Palette } from "lucide-react";
import { toast } from "sonner";
import type { ReferralReward } from "@/types/database";

const TIERS = [
  { count: 1, label: "Referrer Badge", icon: UserPlus, description: "Refer 1 user" },
  { count: 3, label: "Premium Theme", icon: Palette, description: "Refer 3 users" },
  { count: 5, label: "Ambassador Badge", icon: Crown, description: "Refer 5 users" },
];

export function ReferralPanel({
  referralCode,
  referralCount,
  rewards,
}: {
  referralCode: string;
  referralCount: number;
  rewards: ReferralReward[];
}) {
  const [copied, setCopied] = useState(false);

  const referralUrl = typeof window !== "undefined"
    ? `${window.location.origin}/signup?ref=${referralCode}`
    : `/signup?ref=${referralCode}`;

  function handleCopy() {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
        <p className="text-muted-foreground mt-1">
          Invite friends and earn rewards.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={referralUrl} readOnly className="font-mono text-sm" />
            <Button onClick={handleCopy} variant="outline" className="shrink-0 gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{referralCount} {referralCount === 1 ? "person" : "people"} referred</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reward Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TIERS.map((tier) => {
              const isUnlocked = referralCount >= tier.count;
              return (
                <div
                  key={tier.count}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    isUnlocked
                      ? "border-primary/30 bg-primary/5"
                      : "border-border opacity-60"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full ${
                      isUnlocked ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <tier.icon
                      className={`h-5 w-5 ${
                        isUnlocked ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{tier.label}</p>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                  {isUnlocked && (
                    <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
                      Unlocked
                    </span>
                  )}
                  {!isUnlocked && (
                    <span className="text-xs text-muted-foreground">
                      {tier.count - referralCount} more needed
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {rewards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Earned Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">{reward.reward_value}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(reward.unlocked_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
