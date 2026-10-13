"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProjectFormData {
  title: string;
  slug: string;
  summary: string;
  description: string;
  image: string;
  technologies: string;
  liveUrl: string;
  githubUrl: string;
}

export default function NewProjectPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    slug: "",
    summary: "",
    description: "",
    image: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function createSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      // Automatically create a slug from the title.
      // The slug can still be edited manually.
      if (name === "title") {
        updated.slug = createSlug(value);
      }

      return updated;
    });

    setError("");
    setSuccess("");
  }

  function isValidOptionalUrl(value: string): boolean {
    if (!value.trim()) {
      return true;
    }

    try {
      const url = new URL(value);

      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.title.trim() ||
      !formData.slug.trim() ||
      !formData.summary.trim() ||
      !formData.description.trim() ||
      !formData.image.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      setError(
        "The slug must contain lowercase letters, numbers, and single hyphens only.",
      );
      return;
    }

    if (
      !isValidOptionalUrl(formData.liveUrl) ||
      !isValidOptionalUrl(formData.githubUrl)
    ) {
      setError(
        "Please enter valid website URLs beginning with http:// or https://.",
      );
      return;
    }

    const technologies = formData.technologies
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean);

    const projectData = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      summary: formData.summary.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      technologies,
      liveUrl: formData.liveUrl.trim(),
      githubUrl: formData.githubUrl.trim(),
    };

    try {
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Failed to create the project.",
        );
      }

      setSuccess("Project created successfully!");

      setFormData({
        title: "",
        slug: "",
        summary: "",
        description: "",
        image: "",
        technologies: "",
        liveUrl: "",
        githubUrl: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the project.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-md sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add New Project</h1>

          <p className="mt-2 text-gray-600">
            Add a new web project to your portfolio.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-green-300 bg-green-50 p-4 text-green-700"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label htmlFor="title" className="mb-2 block font-medium">
              Project Title *
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Memory Game"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Project Slug */}
          <div>
            <label htmlFor="slug" className="mb-2 block font-medium">
              Slug *
            </label>

            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              placeholder="memory-game"
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              title="Use lowercase letters, numbers, and single hyphens."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              Used in your project URL. Generated from the title, but editable.
            </p>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="mb-2 block font-medium">
              Summary *
            </label>

            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="A short summary of your project."
              rows={3}
              required
              maxLength={300}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              Maximum 300 characters.
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-2 block font-medium">
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe how your project works and what you learned."
              rows={6}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Project Image */}
          <div>
            <label htmlFor="image" className="mb-2 block font-medium">
              Project Image Path *
            </label>

            <input
              id="image"
              name="image"
              type="text"
              value={formData.image}
              onChange={handleChange}
              placeholder="/images/projects/memory-game.jpg"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              Place your image in the frontend public folder and enter its
              public path.
            </p>

            {formData.image.trim() && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Image Preview</p>

                <Image
                  src={formData.image}
                  alt="Project preview"
                  className="h-48 w-full rounded-lg border border-gray-200 object-cover"
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                  onLoad={(event) => {
                    event.currentTarget.hidden = false;
                  }}
                />
              </div>
            )}
          </div>

          {/* Technologies */}
          <div>
            <label htmlFor="technologies" className="mb-2 block font-medium">
              Technologies Used
            </label>

            <input
              id="technologies"
              name="technologies"
              type="text"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Tailwind CSS, Firebase"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              Separate each technology with a comma.
            </p>
          </div>

          {/* Live Website URL */}
          <div>
            <label htmlFor="liveUrl" className="mb-2 block font-medium">
              Live Project URL
            </label>

            <input
              id="liveUrl"
              name="liveUrl"
              type="url"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* GitHub URL */}
          <div>
            <label htmlFor="githubUrl" className="mb-2 block font-medium">
              GitHub Repository URL
            </label>

            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Form Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Project..." : "Create Project"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/Admin")}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
