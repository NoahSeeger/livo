"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Goal, GoalCategory, GoalStatus } from "@/types";

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "personal" as GoalCategory,
  });
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("goals").insert([
        {
          user_id: user.id,
          title: newGoal.title,
          description: newGoal.description,
          category: newGoal.category,
          status: "not_started" as GoalStatus,
        },
      ]);

      if (error) throw error;

      setNewGoal({ title: "", description: "", category: "personal" });
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const handleUpdateStatus = async (goalId: string, newStatus: GoalStatus) => {
    try {
      const { error } = await supabase
        .from("goals")
        .update({ status: newStatus })
        .eq("id", goalId);

      if (error) throw error;
      fetchGoals();
    } catch (error) {
      console.error("Error updating goal status:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Life Goals</h1>

      <form
        onSubmit={handleAddGoal}
        className="bg-white p-6 rounded-lg shadow-sm mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={newGoal.description}
              onChange={(e) =>
                setNewGoal({ ...newGoal, description: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={newGoal.category}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  category: e.target.value as GoalCategory,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="adventure">Adventure</option>
              <option value="health">Health</option>
              <option value="career">Career</option>
              <option value="personal">Personal</option>
              <option value="travel">Travel</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Goal
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white p-6 rounded-lg shadow-sm flex items-start justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">{goal.title}</h3>
              {goal.description && (
                <p className="text-gray-600 mt-1">{goal.description}</p>
              )}
              <div className="mt-2">
                <span className="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                  {goal.category}
                </span>
              </div>
            </div>
            <select
              value={goal.status}
              onChange={(e) =>
                handleUpdateStatus(goal.id, e.target.value as GoalStatus)
              }
              className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
