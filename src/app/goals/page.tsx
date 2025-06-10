"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Goal, GoalCategory } from "@/types";
import {
  Plus,
  Target,
  Trophy,
  Edit2,
  Trash2,
  X,
  Check,
  Clock,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "personal" as GoalCategory,
  });
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const TITLE_MAX_LENGTH = 50;
  const DESCRIPTION_MAX_LENGTH = 200;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchGoals = useCallback(async () => {
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
  }, [supabase]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

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
          title: newGoal.title.trim(),
          description: newGoal.description.trim(),
          category: newGoal.category,
          completed: false,
          completed_at: null,
        },
      ]);

      if (error) throw error;

      setNewGoal({ title: "", description: "", category: "personal" });
      setShowAddForm(false);
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const handleToggleComplete = async (
    goalId: string,
    currentStatus: boolean
  ) => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("goals")
        .update({
          completed: !currentStatus,
          completed_at: !currentStatus ? now : null,
        })
        .eq("id", goalId);

      if (error) throw error;

      if (!currentStatus) {
        // Trigger confetti when completing a goal
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FFA500", "#FF8C00", "#FFD700"],
        });
      }

      fetchGoals();
    } catch (error) {
      console.error("Error updating goal status:", error);
    }
  };

  const handleEditGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;

    try {
      const { error } = await supabase
        .from("goals")
        .update({
          title: editingGoal.title.trim(),
          description: editingGoal.description?.trim() || "",
          category: editingGoal.category,
          completed_at: editingGoal.completed_at,
        })
        .eq("id", editingGoal.id);

      if (error) throw error;
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      const { error } = await supabase.from("goals").delete().eq("id", goalId);
      if (error) throw error;
      fetchGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = {
    total: goals.length,
    completed: goals.filter((g) => g.completed).length,
    active: goals.filter((g) => !g.completed).length,
  };

  const filteredGoals = goals.filter(
    (goal) => goal.completed === showCompleted
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="text-gray-600">Loading your goals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] py-4 px-4 pb-24 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Your Life Goals
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Track and achieve your personal milestones
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom)+1rem)] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm sm:static sm:w-auto inline-flex items-center justify-center px-4 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 z-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Goal
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-orange-100">
            <div className="text-sm text-gray-600">Total Goals</div>
            <div className="text-2xl font-bold text-gray-800">
              {stats.total}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-orange-100">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-2xl font-bold text-orange-500">
              {stats.completed}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-orange-100">
            <div className="text-sm text-gray-600">Active</div>
            <div className="text-2xl font-bold text-orange-500">
              {stats.active}
            </div>
          </div>
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <div className="fixed inset-0 z-[999] bg-white sm:bg-transparent sm:relative flex items-start sm:block justify-center p-4 sm:p-0 overflow-y-auto">
            <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm border-2 border-orange-100 w-full max-w-sm sm:max-w-none sm:mb-6 mt-8 sm:mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Add New Goal
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="title"
                      value={newGoal.title}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, title: e.target.value })
                      }
                      maxLength={TITLE_MAX_LENGTH}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      placeholder="What do you want to achieve?"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      {newGoal.title.length}/{TITLE_MAX_LENGTH}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      value={newGoal.description}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, description: e.target.value })
                      }
                      maxLength={DESCRIPTION_MAX_LENGTH}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      placeholder="Add some details about your goal..."
                    />
                    <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                      {newGoal.description.length}/{DESCRIPTION_MAX_LENGTH}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  >
                    <option value="personal">Personal</option>
                    <option value="career">Career</option>
                    <option value="health">Health</option>
                    <option value="travel">Travel</option>
                    <option value="adventure">Adventure</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl border-2 border-orange-100 text-orange-600 hover:bg-orange-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200"
                  >
                    Add Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-1 rounded-xl border-2 border-orange-100 inline-flex">
            <button
              onClick={() => setShowCompleted(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !showCompleted
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-orange-50"
              }`}
            >
              Active Goals
            </button>
            <button
              onClick={() => setShowCompleted(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showCompleted
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-orange-50"
              }`}
            >
              Completed Goals
            </button>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white p-4 rounded-2xl shadow-sm border-2 border-orange-100 hover:border-orange-200 transition-all"
            >
              {editingGoal?.id === goal.id ? (
                <form onSubmit={handleEditGoal} className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={editingGoal.title}
                        onChange={(e) =>
                          setEditingGoal({
                            ...editingGoal,
                            title: e.target.value,
                          })
                        }
                        maxLength={TITLE_MAX_LENGTH}
                        className="w-full px-3 py-2 rounded-lg border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg font-semibold"
                      />
                      <textarea
                        value={editingGoal.description || ""}
                        onChange={(e) =>
                          setEditingGoal({
                            ...editingGoal,
                            description: e.target.value,
                          })
                        }
                        maxLength={DESCRIPTION_MAX_LENGTH}
                        rows={2}
                        className="w-full px-3 py-2 mt-2 rounded-lg border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      />
                      <select
                        value={editingGoal.category}
                        onChange={(e) =>
                          setEditingGoal({
                            ...editingGoal,
                            category: e.target.value as GoalCategory,
                          })
                        }
                        className="mt-2 px-3 py-1.5 rounded-lg border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      >
                        <option value="personal">Personal</option>
                        <option value="career">Career</option>
                        <option value="health">Health</option>
                        <option value="travel">Travel</option>
                        <option value="adventure">Adventure</option>
                        <option value="other">Other</option>
                      </select>
                      {goal.completed && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Completed At
                          </label>
                          <input
                            type="datetime-local"
                            value={
                              goal.completed_at
                                ? new Date(goal.completed_at)
                                    .toISOString()
                                    .slice(0, 16)
                                : ""
                            }
                            onChange={(e) =>
                              setEditingGoal({
                                ...editingGoal,
                                completed_at: e.target.value
                                  ? new Date(e.target.value).toISOString()
                                  : null,
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-2">
                      <button
                        type="submit"
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingGoal(null)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {goal.completed ? (
                        <Trophy className="h-5 w-5 text-orange-500" />
                      ) : (
                        <Target className="h-5 w-5 text-gray-400" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-800">
                        {goal.title}
                      </h3>
                    </div>
                    {goal.description && (
                      <p className="text-gray-600 mt-2 text-sm">
                        {goal.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          goal.completed
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {goal.category}
                      </span>
                      {goal.completed && goal.completed_at && (
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(goal.completed_at)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() =>
                        handleToggleComplete(goal.id, goal.completed)
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        goal.completed
                          ? "text-orange-500 hover:bg-orange-50"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No goals found
            </h3>
            <p className="text-gray-600">
              {showCompleted
                ? "You haven't completed any goals yet!"
                : "Start by adding your first goal!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
