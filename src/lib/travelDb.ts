import { createClient } from "./supabaseClient";

// Create a single instance of the Supabase client
const supabase = createClient();

// Helper to get current authenticated user's ID
export async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
  return data.user?.id || null;
}

interface TravelExperience {
  country_code: string;
  visited: boolean; // true for 'visited', false for 'bucket-list'
  id?: string; // Supabase row ID if exists
}

export async function getTravelExperiences(
  userId: string
): Promise<TravelExperience[]> {
  const { data, error } = await supabase
    .from("travel_experiences")
    .select("id, country_code, visited")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching travel experiences:", error.message);
    return [];
  }
  return data || [];
}

export async function upsertTravelExperience(
  userId: string,
  countryCode: string,
  status: "visited" | "bucket-list"
): Promise<{ success: boolean; error?: string }> {
  const visitedStatus = status === "visited";

  try {
    // Check if a record already exists for this user and country
    const { data: existingRecords, error: fetchError } = await supabase
      .from("travel_experiences")
      .select("id")
      .eq("user_id", userId)
      .eq("country_code", countryCode);

    if (fetchError) {
      console.error("Error checking existing record:", fetchError.message);
      return { success: false, error: fetchError.message };
    }

    if (existingRecords && existingRecords.length > 0) {
      // Update existing record
      const { error } = await supabase
        .from("travel_experiences")
        .update({
          visited: visitedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingRecords[0].id)
        .eq("user_id", userId); // Add this to ensure RLS policy is satisfied

      if (error) {
        console.error("Error updating travel experience:", error.message);
        return { success: false, error: error.message };
      }
    } else {
      // Insert new record
      const { error } = await supabase.from("travel_experiences").insert({
        user_id: userId,
        country_code: countryCode,
        visited: visitedStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error inserting travel experience:", error.message);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error in upsertTravelExperience:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTravelExperience(
  userId: string,
  countryCode: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("travel_experiences")
    .delete()
    .eq("user_id", userId)
    .eq("country_code", countryCode);

  if (error) {
    console.error("Error deleting travel experience:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
}
