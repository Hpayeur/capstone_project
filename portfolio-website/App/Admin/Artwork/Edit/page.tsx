"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

interface BookFormData {
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  externalUrl: string;
  author: string;
  genre: string;
  publishedDate: string;
}

interface ApiResponse {
  success?: boolean;
  data?: Partial<BookFormData> & {
    publishedDate?: string | Date;
  };
  error?: string;
  message?: string;
}

const initialFormData: BookFormData = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  coverImage: "",
  externalUrl: "",
  author: "",
  genre: "",
  publishedDate: "",
};

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const bookSlug = params.slug;

  const [formData, setFormData] = useState<BookFormData>(initialFormData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // Load the existing book.
  useEffect(() => {
    if (!bookSlug) return;

    const controller = new AbortController();

    async function loadBook() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${apiBaseUrl}/api/books/${encodeURIComponent(bookSlug)}`,
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          },
        );

        const result: ApiResponse = await response.json();

        if (!response.ok || result.success === false || !result.data) {
          throw new Error(result.error || "Unable to load this book.");
        }

        const book = result.data;

        setFormData({
          title: book.title ?? "",
          slug: book.slug ?? "",
          summary: book.summary ?? "",
          description: book.description ?? "",
          coverImage: book.coverImage ?? "",
          externalUrl: book.externalUrl ?? "",
          author: book.author ?? "",
          genre: book.genre ?? "",
          publishedDate: book.publishedDate
            ? String(book.publishedDate).slice(0, 10)
            : "",
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while loading the book.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => controller.abort();
  }, [bookSlug, apiBaseUrl]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function generateSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
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
      !formData.coverImage.trim() ||
      !formData.author.trim() ||
      !formData.genre.trim() ||
      !formData.publishedDate
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(formData.slug)) {
      setError("The slug must use lowercase letters, numbers, and hyphens.");
      return;
    }

    if (
      formData.externalUrl.trim() &&
      !/^https?:\/\/.+/i.test(formData.externalUrl.trim())
    ) {
      setError(
        "Enter a valid external URL beginning with http:// or https://.",
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/books/${encodeURIComponent(bookSlug)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            title: formData.title.trim(),
            slug: formData.slug.trim(),
            summary: formData.summary.trim(),
            description: formData.description.trim(),
            coverImage: formData.coverImage.trim(),
            externalUrl: formData.externalUrl.trim() || undefined,
            author: formData.author.trim(),
            genre: formData.genre.trim(),
            publishedDate: formData.publishedDate,
          }),
        },
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.error || "Failed to update the book.");
      }

      setSuccess("Book updated successfully!");

      // If the slug changed, the new URL should use the new slug.
      const updatedSlug = result.data?.slug ?? formData.slug;

      router.replace(`/Admin/Book/Edit/${encodeURIComponent(updatedSlug)}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the book.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <p className="text-lg text-gray-600">Loading book...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 text-gray-900 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/Admin")}
            className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Admin Dashboard
          </button>

          <h1 className="text-3xl font-bold">Edit Book</h1>

          <p className="mt-2 text-gray-600">
            Update the details of your existing book.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-white p-6 shadow-md sm:p-8"
        >
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

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
              Book Title *
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={(event) => {
                const value = event.target.value;

                setFormData((previous) => ({
                  ...previous,
                  title: value,
                  slug:
                    previous.slug === generateSlug(previous.title) ||
                    !previous.slug
                      ? generateSlug(value)
                      : previous.slug,
                }));
              }}
              required
              maxLength={150}
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
              value={formData.slug}
              onChange={handleChange}
              required
              maxLength={160}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <p className="mt-1 text-sm text-gray-500">
              Used in the book&apos;s URL. Use lowercase letters, numbers, and
              hyphens.
            </p>
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="mb-2 block font-medium">
              Author *
            </label>
            <input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              maxLength={150}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="mb-2 block font-medium">
              Genre *
            </label>
            <input
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Published Date */}
          <div>
            <label htmlFor="publishedDate" className="mb-2 block font-medium">
              Published Date *
            </label>
            <input
              id="publishedDate"
              name="publishedDate"
              type="date"
              value={formData.publishedDate}
              onChange={handleChange}
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
              rows={6}
              required
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label htmlFor="coverImage" className="mb-2 block font-medium">
              Cover Image Path *
            </label>
            <input
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="/images/books/my-book.jpg"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              Enter the image&apos;s public path, such as
              /images/books/my-book.jpg.
            </p>

            {formData.coverImage.trim() && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Cover Preview</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.coverImage}
                  alt="Book cover preview"
                  className="h-64 w-44 rounded-lg border border-gray-200 object-cover"
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
              External Book Link
            </label>
            <input
              id="externalUrl"
              name="externalUrl"
              type="url"
              value={formData.externalUrl}
              onChange={handleChange}
              placeholder="https://example.com/my-book"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/Admin")}
              disabled={saving}
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
