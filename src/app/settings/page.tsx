"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import {
  Mail,
  Lock,
  User,
  LogOut,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  const [importingData, setImportingData] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!session) {
      router.push("/welcome");
    } else {
      setEmail(session.user.email || "");
      setUsername(
        session.user.user_metadata?.username || session.user.email || ""
      );
    }
  }, [session, router]);

  const handleChangeEmail = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!newEmail) {
      toast.error("New email cannot be empty.");
      setLoading(false);
      return;
    }
    if (newEmail === email) {
      toast.error("New email is the same as current email.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) {
      toast.error(`Error changing email: ${error.message}`);
    } else {
      toast.success(
        "Email change request sent. Check your new email for confirmation."
      );
      setEmail(newEmail);
      setNewEmail("");
    }
    setLoading(false);
  };

  const handleChangeUsername = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!newUsername) {
      toast.error("Username cannot be empty.");
      setLoading(false);
      return;
    }
    if (newUsername === username) {
      toast.error("New username is the same as current username.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      data: { username: newUsername },
    });

    if (error) {
      toast.error(`Error changing username: ${error.message}`);
    } else {
      toast.success("Username updated successfully.");
      setUsername(newUsername);
      setNewUsername("");
    }
    setLoading(false);
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error(`Error changing password: ${error.message}`);
    } else {
      toast.success("Password updated successfully.");
      setPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`Error signing out: ${error.message}`);
    } else {
      toast.success("Signed out successfully.");
      router.push("/welcome");
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    toast.error(
      "Account deletion is not directly supported via the client-side. Please contact support."
    );
    setLoading(false);
  };

  const handleDownloadAccountData = async () => {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase
        .from("users") // Assuming you have a 'users' table. Adjust if your user data is elsewhere.
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      const dataToDownload = {
        auth_user_id: session?.user?.id,
        auth_email: session?.user?.email,
        auth_created_at: session?.user?.created_at,
        auth_last_sign_in_at: session?.user?.last_sign_in_at,
        auth_user_metadata: session?.user?.user_metadata,
        user_table_data: userData, // Your custom user table data
      };

      const filename = `livo-account-data-${session?.user?.id}.json`;
      const jsonStr = JSON.stringify(dataToDownload, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);

      toast.success("Your account data has been downloaded.");
    } catch (error) {
      console.error("Error downloading account data:", error);
      toast.error(
        `Failed to download account data: ${(error as Error).message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadGoalsTravelData = async () => {
    setLoading(true);
    try {
      if (!session?.user?.id) {
        toast.error("User not logged in. Cannot download data.");
        setLoading(false);
        return;
      }

      const { data: goalsData, error: goalsError } = await supabase
        .from("goals") // Assuming your goals table is named 'goals'
        .select("*")
        .eq("user_id", session.user.id);

      if (goalsError) {
        console.error("Supabase goals fetch error:", goalsError);
        throw new Error(
          `Failed to fetch goals: ${goalsError.message || "Unknown error"}`
        );
      }

      const { data: travelData, error: travelError } = await supabase
        .from("travel_experiences") // Corrected table name
        .select("*")
        .eq("user_id", session.user.id);

      if (travelError) {
        console.error("Supabase travel experiences fetch error:", travelError);
        throw new Error(
          `Failed to fetch travel entries: ${
            travelError.message || "Unknown error"
          }`
        );
      }

      const dataToDownload = {
        goals: goalsData,
        travel_entries: travelData,
      };

      const filename = `livo-goals-travel-data-${session.user.id}.json`;
      const jsonStr = JSON.stringify(dataToDownload, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);

      toast.success("Your goals and travel data has been downloaded.");
    } catch (error) {
      console.error("Caught error during goals/travel data download:", error);
      toast.error(
        `Failed to download goals/travel data: ${
          (error as Error).message || "An unexpected error occurred"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleImportData = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to import.");
      return;
    }

    setImportingData(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const result = e.target?.result as string;
        const importedData = JSON.parse(result);

        let goalsImportedCount = 0;
        let travelImportedCount = 0;
        let importErrors: string[] = [];

        if (typeof importedData !== "object" || importedData === null) {
          throw new Error("Invalid JSON format. Expected an object.");
        }

        if (importedData.goals && !Array.isArray(importedData.goals)) {
          throw new Error("Invalid 'goals' format. Expected an array.");
        }

        if (
          importedData.travel_entries &&
          !Array.isArray(importedData.travel_entries)
        ) {
          throw new Error(
            "Invalid 'travel_entries' format. Expected an array."
          );
        }

        if (importedData.goals) {
          for (const goal of importedData.goals) {
            try {
              // Ensure user_id is correct for imported data and remove existing id
              const { id, ...goalToInsert } = goal;
              const { error } = await supabase
                .from("goals")
                .insert({ ...goalToInsert, user_id: session?.user?.id });
              if (error) {
                throw error;
              }
              goalsImportedCount++;
            } catch (error) {
              importErrors.push(
                `Failed to import goal: ${(error as Error).message}`
              );
            }
          }
        }

        if (importedData.travel_entries) {
          for (const entry of importedData.travel_entries) {
            try {
              // Ensure user_id is correct for imported data and remove existing id
              const { id, ...entryToInsert } = entry;
              const { error } = await supabase
                .from("travel_experiences")
                .insert({ ...entryToInsert, user_id: session?.user?.id });
              if (error) {
                throw error;
              }
              travelImportedCount++;
            } catch (error) {
              importErrors.push(
                `Failed to import travel entry: ${(error as Error).message}`
              );
            }
          }
        }

        if (goalsImportedCount > 0 || travelImportedCount > 0) {
          toast.success(
            `Successfully imported ${goalsImportedCount} goals and ${travelImportedCount} travel entries.`
          );
        } else if (importErrors.length > 0) {
          toast.error(
            "Import completed with errors. Check console for details."
          );
        } else {
          toast.success("No data to import or no new data found.");
        }

        if (importErrors.length > 0) {
          console.error("Import Errors:", importErrors);
          importErrors.forEach((err) => toast.error(err));
        }
      } catch (error) {
        console.error("Error importing data:", error);
        toast.error(`Failed to import data: ${(error as Error).message}`);
      } finally {
        setImportingData(false);
        setSelectedFile(null);
      }
    };

    reader.onerror = () => {
      setImportingData(false);
      toast.error("Error reading file.");
    };

    reader.readAsText(selectedFile);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Information */}
        <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <User size={24} className="mr-3 text-orange-500" />
            Account Information
          </h2>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Email:</span> {email}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Username:</span> {username}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">User ID:</span> {session.user.id}
          </p>
        </div>

        {/* Change Email */}
        <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Mail size={24} className="mr-3 text-orange-500" />
            Change Email
          </h2>
          <form onSubmit={handleChangeEmail} className="space-y-4">
            <div>
              <label
                htmlFor="new-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Email
              </label>
              <input
                type="email"
                id="new-email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800 placeholder-gray-400"
                placeholder="your.new.email@example.com"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Email"}
            </button>
          </form>
        </div>

        {/* Change Username */}
        <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <User size={24} className="mr-3 text-orange-500" />
            Change Username
          </h2>
          <form onSubmit={handleChangeUsername} className="space-y-4">
            <div>
              <label
                htmlFor="new-username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Username
              </label>
              <input
                type="text"
                id="new-username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800 placeholder-gray-400"
                placeholder="Enter new username"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Username"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Lock size={24} className="mr-3 text-orange-500" />
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800 placeholder-gray-400"
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800 placeholder-gray-400"
                placeholder="Confirm new password"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Download Data */}
        <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Download size={24} className="mr-3 text-orange-500" />
            Download Data
          </h2>
          <p className="text-gray-600 mb-4">
            Export your account information or your goals and travel data.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleDownloadAccountData}
              className="inline-flex items-center px-8 py-4 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
              disabled={loading}
            >
              <Download size={20} className="mr-2" />
              {loading ? "Preparing Account Data..." : "Download Account Data"}
            </button>
            <button
              onClick={handleDownloadGoalsTravelData}
              className="inline-flex items-center px-8 py-4 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
              disabled={loading}
            >
              <Download size={20} className="mr-2" />
              {loading
                ? "Preparing Goals & Travel Data..."
                : "Download Goals & Travel Data"}
            </button>
          </div>
        </div>

        {/* Import Data */}
        <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Upload size={24} className="mr-3 text-orange-500" />
            Import Data
          </h2>
          <p className="text-gray-600 mb-4">
            Import goals and travel data from a JSON file.
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-sm file:font-semibold
              file:bg-orange-50 file:text-orange-700
              hover:file:bg-orange-100
              mb-4
            "
          />
          <button
            onClick={handleImportData}
            className="inline-flex items-center px-8 py-4 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
            disabled={importingData || !selectedFile}
          >
            <Upload size={20} className="mr-2" />
            {importingData ? "Importing..." : "Import Data"}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Trash2 size={24} className="mr-3 text-red-500" />
            Danger Zone
          </h2>
          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-8 py-4 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
              disabled={loading}
            >
              <LogOut size={20} className="mr-2" />
              {loading ? "Signing Out..." : "Sign Out"}
            </button>
            <button
              onClick={handleDeleteAccount}
              className="inline-flex items-center px-8 py-4 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
              disabled={loading}
            >
              <Trash2 size={20} className="mr-2" />
              {loading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
