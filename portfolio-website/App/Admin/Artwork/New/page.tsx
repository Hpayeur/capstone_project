"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface ArtworkFormData {
  title: string;
  slug: string;
  summary: string;
  description: string;
  image: string;
  externalUrl: string;
  artist: string;
  medium: string;
  dimensions: string;
  yearCreated: string;
}

const initialFormData: ArtworkFormData = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  image: "",
  externalUrl: "",
  artist: "",
  medium: "",
  dimensions: "",
  yearCreated: "",
};

export default function NewArtworkPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ArtworkFormData>(initialFormData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function generateSlug(value: string): string {
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

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "title" ? { slug: generateSlug(value) } : {}),
    }));
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
      !formData.image.trim() ||
      !formData.artist.trim() ||
      !formData.medium.trim() ||
      !formData.yearCreated
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(formData.slug)) {
      setError(
        "The slug must contain lowercase letters, numbers, and single hyphens between words.",
      );
      return;
    }

    if (
      formData.externalUrl.trim() &&
      !/^https?:\/\/.+/i.test(formData.externalUrl.trim())
    ) {
      setError(
        "Please enter a valid external URL beginning with http:// or https://.",
      );
      return;
    }

    const year = Number(formData.yearCreated);
    const currentYear = new Date().getFullYear();

    if (!Number.isInteger(year) || year < 1 || year > currentYear) {
      setError(`Enter a valid year between 1 and ${currentYear}.`);
      return;
    }

    setLoading(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

      const response = await fetch(`${apiBaseUrl}/api/artwork`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          summary: formData.summary.trim(),
          description: formData.description.trim(),
          image: formData.image.trim(),
          externalUrl: formData.externalUrl.trim() || undefined,
          artist: formData.artist.trim(),
          medium: formData.medium.trim(),
          dimensions: formData.dimensions.trim() || undefined,
          yearCreated: year,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.error || "Failed to create the artwork.");
      }

      setSuccess("Artwork created successfully!");
      setFormData(initialFormData);

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the artwork.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 text-gray-900 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Page Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/Admin")}
            className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Admin Dashboard
          </button>

          <h1 className="text-3xl font-bold">Add New Artwork</h1>

          <p className="mt-2 text-gray-600">
            Add a new piece of artwork to your portfolio.
          </p>
        </div>

        {/* Artwork Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-white p-6 shadow-md sm:p-8"
        >
          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-2 block font-medium">
              Artwork Title *
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter the artwork title"
              maxLength={150}
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
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  slug: event.target.value,
                }))
              }
              placeholder="my-artwork"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              maxLength={160}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              Generated from the title automatically. You can edit it. Use
              lowercase letters, numbers, and hyphens.
            </p>
          </div>

          {/* Artist */}
          <div>
            <label htmlFor="artist" className="mb-2 block font-medium">
              Artist *
            </label>

            <input
              id="artist"
              name="artist"
              type="text"
              value={formData.artist}
              onChange={handleChange}
              placeholder="Enter the artist's name"
              maxLength={150}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Medium */}
          <div>
            <label htmlFor="medium" className="mb-2 block font-medium">
              Medium *
            </label>

            <input
              id="medium"
              name="medium"
              type="text"
              value={formData.medium}
              onChange={handleChange}
              placeholder="Digital art, watercolor, pencil, etc."
              maxLength={150}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Year Created */}
          <div>
            <label htmlFor="yearCreated" className="mb-2 block font-medium">
              Year Created *
            </label>

            <input
              id="yearCreated"
              name="yearCreated"
              type="number"
              value={formData.yearCreated}
              onChange={handleChange}
              placeholder="2026"
              min={1}
              max={new Date().getFullYear()}
              step={1}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Dimensions */}
          <div>
            <label htmlFor="dimensions" className="mb-2 block font-medium">
              Dimensions
            </label>

            <input
              id="dimensions"
              name="dimensions"
              type="text"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="1920 × 1080 px, 12 × 16 inches, etc."
              maxLength={100}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              Optional. Enter the artwork&apos;s dimensions or resolution.
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
              placeholder="Write a short summary of the artwork"
              rows={3}
              maxLength={500}
              required
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              {formData.summary.length}/500 characters
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
              placeholder="Describe the artwork, its inspiration, and its details"
              rows={6}
              required
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Artwork Image */}
          <div>
            <label htmlFor="image" className="mb-2 block font-medium">
              Artwork Image Path *
            </label>

            <input
              id="image"
              name="image"
              type="text"
              value={formData.image}
              onChange={handleChange}
              placeholder="/images/artwork/my-artwork.jpg"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              Place your image in the frontend public/images/artwork folder,
              then enter its public path above.
            </p>

            {formData.image.trim() && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Artwork Preview</p>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.image}
                  alt="Artwork preview"
                  className="max-h-80 max-w-full rounded-lg border border-gray-200 object-contain"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.visibility = "visible";
                  }}
                />
              </div>
            )}
          </div>

          {/* External URL */}
          <div>
            <label htmlFor="externalUrl" className="mb-2 block font-medium">
              External Link
            </label>

            <input
              id="externalUrl"
              name="externalUrl"
              type="url"
              value={formData.externalUrl}
              onChange={handleChange}
              placeholder="https://example.com/my-artwork"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              Optional. Link to the original artwork or its published page.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving Artwork..." : "Add Artwork"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/Admin")}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
