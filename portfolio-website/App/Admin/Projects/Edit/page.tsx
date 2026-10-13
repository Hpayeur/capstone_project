"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

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

const INITIAL_FORM: ProjectFormData = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  image: "",
  technologies: "",
  liveUrl: "",
  githubUrl: "",
};

export default function EditProjectPage() {
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [originalSlug, setOriginalSlug] = useState("");
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProject, setLoadingProject] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load all projects for the dropdown.
  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch(`${apiUrl}/api/projects`, {
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || result.error || "Failed to load projects.",
          );
        }

        const projectList: Project[] = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : [];

        setProjects(projectList);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error ? err.message : "Unable to load projects.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProjects(false);
        }
      }
    }

    loadProjects();

    return () => controller.abort();
  }, [apiUrl]);

  // Load the selected project's details.
  useEffect(() => {
    if (!selectedSlug) {
      return;
    }

    const controller = new AbortController();

    async function loadProject() {
      try {
        const response = await fetch(
          `${apiUrl}/api/projects/${encodeURIComponent(selectedSlug)}`,
          { signal: controller.signal },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || result.error || "Failed to load project details.",
          );
        }

        const project: Project = result.data ?? result;

        setOriginalSlug(project.slug);

        setFormData({
          title: project.title ?? "",
          slug: project.slug ?? "",
          summary: project.summary ?? "",
          description: project.description ?? "",
          image: project.image ?? "",
          technologies: Array.isArray(project.technologies)
            ? project.technologies.join(", ")
            : "",
          liveUrl: project.liveUrl ?? "",
          githubUrl: project.githubUrl ?? "",
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load project details.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProject(false);
        }
      }
    }

    loadProject();

    return () => controller.abort();
  }, [selectedSlug, apiUrl]);

  // Handle changes to form fields.
  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // Validate optional website URLs.
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

  // Handle project selection.
  function handleProjectSelection(event: ChangeEvent<HTMLSelectElement>) {
    const slug = event.target.value;

    setSelectedSlug(slug);
    setError("");
    setSuccess("");

    if (!slug) {
      setFormData(INITIAL_FORM);
      setOriginalSlug("");
      setLoadingProject(false);
      return;
    }

    setFormData(INITIAL_FORM);
    setOriginalSlug("");
    setLoadingProject(true);
  }

  // Submit the updated project.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!originalSlug) {
      setError("Please select a project to edit.");
      return;
    }

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

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug.trim())) {
      setError(
        "The slug must contain lowercase letters, numbers, and single hyphens only.",
      );
      return;
    }

    if (
      !isValidOptionalUrl(formData.liveUrl) ||
      !isValidOptionalUrl(formData.githubUrl)
    ) {
      setError("Enter valid URLs beginning with http:// or https://.");
      return;
    }

    const projectData = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      summary: formData.summary.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      technologies: formData.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
      liveUrl: formData.liveUrl.trim(),
      githubUrl: formData.githubUrl.trim(),
    };

    try {
      setSaving(true);

      const response = await fetch(
        `${apiUrl}/api/projects/${encodeURIComponent(originalSlug)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Failed to update project.",
        );
      }

      const updatedProject: Project = result.data ?? {
        ...projectData,
        _id:
          projects.find((project) => project.slug === originalSlug)?._id ?? "",
      };

      // Update the project in the dropdown.
      setProjects((previous) =>
        previous.map((project) =>
          project.slug === originalSlug
            ? {
                ...project,
                ...updatedProject,
                ...projectData,
              }
            : project,
        ),
      );

      const newSlug = projectData.slug;

      setOriginalSlug(newSlug);
      setSuccess("Project updated successfully!");

      // If the slug changed, update the selection.
      if (newSlug !== selectedSlug) {
        setLoadingProject(true);
        setSelectedSlug(newSlug);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the project.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-md sm:p-8">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold">Edit Project</h1>

        <p className="mb-8 mt-2 text-gray-600">
          Select a project, edit its information, and save your changes.
        </p>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700"
          >
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-green-300 bg-green-50 p-4 text-green-700"
          >
            {success}
          </div>
        )}

        {/* Project Selector */}
        <div className="mb-8">
          <label htmlFor="projectSelector" className="mb-2 block font-medium">
            Select Project *
          </label>

          <select
            id="projectSelector"
            value={selectedSlug}
            onChange={handleProjectSelection}
            disabled={loadingProjects || saving}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">
              {loadingProjects ? "Loading projects..." : "Choose a project"}
            </option>

            {projects.map((project) => (
              <option key={project._id || project.slug} value={project.slug}>
                {project.title}
              </option>
            ))}
          </select>

          {!loadingProjects && projects.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              No projects found. Create a project before editing one.
            </p>
          )}
        </div>

        {/* Loading Message */}
        {loadingProject && (
          <p className="mb-6 text-blue-600">Loading project details...</p>
        )}

        {/* Edit Form */}
        {selectedSlug && !loadingProject && originalSlug && (
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
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Slug */}
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
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                title="Use lowercase letters, numbers, and single hyphens."
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
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
                rows={3}
                maxLength={300}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
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
                rows={6}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Image Path */}
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

              {/* Image Preview */}
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
                Separate technologies with commas.
              </p>
            </div>

            {/* Live Project URL */}
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
                disabled={saving || loadingProject}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/Admin")}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
