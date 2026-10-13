"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function NewBookPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<BookFormData>(initialFormData);

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
      !formData.coverImage.trim() ||
      !formData.author.trim() ||
      !formData.genre.trim() ||
      !formData.publishedDate
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.externalUrl && !/^https?:\/\/.+/i.test(formData.externalUrl)) {
      setError(
        "Please enter a valid external URL beginning with https:// or http://.",
      );
      return;
    }

    setLoading(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

      const response = await fetch(`${apiBaseUrl}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          externalUrl: formData.externalUrl.trim() || undefined,
          publishedDate: formData.publishedDate,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.error || "Failed to create the book.");
      }

      setSuccess("Book created successfully!");

      setFormData(initialFormData);

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the book.",
      );
    } finally {
      setLoading(false);
    }
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

          <h1 className="text-3xl font-bold">Add a New Book</h1>

          <p className="mt-2 text-gray-600">
            Add a book to display in the Books section of your portfolio.
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

          {/* Book Title */}
          <div>
            <label htmlFor="title" className="mb-2 block font-medium">
              Book Title *
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter the book title"
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
              type="text"
              value={formData.slug}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  slug: event.target.value,
                }))
              }
              placeholder="my-book-title"
              required
              maxLength={160}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              Automatically generated from the title. You can edit it. Use
              lowercase letters, numbers, and hyphens.
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
              type="text"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter the author's name"
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
              type="text"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Fantasy, Romance, Sci-Fi, etc."
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
              placeholder="Write a short summary of the book"
              rows={3}
              required
              maxLength={500}
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
              placeholder="Write the full description of the book"
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
              type="text"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="/images/books/my-book.jpg"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-sm text-gray-500">
              Place the image in your frontend public/images/books folder and
              enter its public path here.
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

            <p className="mt-1 text-sm text-gray-500">
              Optional. Link to the book website or publication page.
            </p>
          </div>

          {/* Form Buttons */}
          <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving Book..." : "Add Book"}
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
