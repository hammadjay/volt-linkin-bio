"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Profile } from "@/types/database";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";

export function SettingsForm({
  profile,
  userEmail,
}: {
  profile: Profile;
  userEmail: string;
}) {
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [username, setUsername] = useState(profile.username);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [showStats, setShowStats] = useState(profile.show_stats);
  const [showEmailSignup, setShowEmailSignup] = useState(profile.show_email_signup);
  const [emailSignupText, setEmailSignupText] = useState(profile.email_signup_text || "");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleSaveProfile() {
    setSaving(true);

    if (username !== profile.username) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .neq("id", profile.id)
        .single();

      if (existing) {
        toast.error("Username is already taken");
        setSaving(false);
        return;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim(),
        bio: bio.trim(),
        username: username.trim(),
        avatar_url: avatarUrl || null,
        show_stats: showStats,
        show_email_signup: showEmailSignup,
        email_signup_text: emailSignupText.trim() || null,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated");
      router.refresh();
    }
    setSaving(false);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${profile.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar");
      setUploadingAvatar(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Save avatar URL to profile immediately
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", profile.id);

    if (updateError) {
      toast.error("Failed to save avatar");
    } else {
      setAvatarUrl(publicUrl);
      toast.success("Avatar updated");
      router.refresh();
    }
    setUploadingAvatar(false);
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setChangingPassword(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated");
      setNewPassword("");
    }
    setChangingPassword(false);
  }

  const initials = (displayName || username)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent transition-colors">
                  <Upload className="h-4 w-4" />
                  {uploadingAvatar ? "Uploading..." : "Upload avatar"}
                </div>
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell the world about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{bio.length}/160</p>
          </div>

          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Show click stats on profile</Label>
              <p className="text-xs text-muted-foreground">Display click counts next to links on your public page</p>
            </div>
            <Switch checked={showStats} onCheckedChange={setShowStats} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Email signup form</Label>
              <p className="text-xs text-muted-foreground">Let visitors subscribe to your newsletter</p>
            </div>
            <Switch checked={showEmailSignup} onCheckedChange={setShowEmailSignup} />
          </div>
          {showEmailSignup && (
            <div className="space-y-2">
              <Label htmlFor="email-signup-text">Signup prompt text</Label>
              <Input
                id="email-signup-text"
                placeholder="Subscribe to my newsletter!"
                value={emailSignupText}
                onChange={(e) => setEmailSignupText(e.target.value)}
              />
            </div>
          )}
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={userEmail} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={changingPassword || !newPassword}
          >
            {changingPassword ? "Updating..." : "Update password"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back.
          </p>
          <Button
            variant="destructive"
            onClick={async () => {
              if (!confirm("Are you sure? This action cannot be undone.")) return;
              const { error } = await supabase.rpc("delete_user");
              if (error) {
                toast.error("Failed to delete account. Contact support.");
              } else {
                await supabase.auth.signOut();
                router.push("/");
              }
            }}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
