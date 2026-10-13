"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Book {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  externalUrl?: string;
  author: string;
  genre: string;
  publishedDate: string;
}

interface ApiResponse {
  success?: boolean;
  data?: Book | Book[];
  error?: string;
  message?: string;
}

const initialFormData: Book = {
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

  const [books, setBooks] = useState<Book[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [formData, setFormData] = useState<Book>(initialFormData);

  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingBook, setLoadingBook] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // Load the list of books.
  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      setLoadingBooks(true);
      setError("");

      try {
        const response = await fetch(`${apiBaseUrl}/api/books`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const result: ApiResponse = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.error || "Failed to load books.");
        }

        const loadedBooks = Array.isArray(result.data) ? result.data : [];

        setBooks(loadedBooks);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while loading books.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadingBooks(false);
        }
      }
    }

    loadBooks();

    return () => controller.abort();
  }, [apiBaseUrl]);

  // Load the selected book's full information.
  async function handleBookSelection(event: ChangeEvent<HTMLSelectElement>) {
    const slug = event.target.value;

    setSelectedSlug(slug);
    setFormData(initialFormData);
    setError("");
    setSuccess("");

    if (!slug) {
      return;
    }

    setLoadingBook(true);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/books/${encodeURIComponent(slug)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const result: ApiResponse = await response.json();

      if (
        !response.ok ||
        result.success === false ||
        !result.data ||
        Array.isArray(result.data)
      ) {
        throw new Error(result.error || "Failed to load the selected book.");
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
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while loading the selected book.",
      );
    } finally {
      setLoadingBook(false);
    }
  }

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

    if (!selectedSlug) {
      setError("Please select a book to edit.");
      return;
    }

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
      setError(
        "The slug must contain lowercase letters, numbers, and hyphens.",
      );
      return;
    }

    if (
      formData.externalUrl?.trim() &&
      !/^https?:\/\/.+/i.test(formData.externalUrl.trim())
    ) {
      setError(
        "Please enter a valid external URL beginning with http:// or https://.",
      );
      return;
    }

    setSaving(true);

    try {
      // Use the original slug to locate the book being edited.
      const response = await fetch(
        `${apiBaseUrl}/api/books/${encodeURIComponent(selectedSlug)}`,
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
            externalUrl: formData.externalUrl?.trim() || undefined,
            author: formData.author.trim(),
            genre: formData.genre.trim(),
          }),
        },
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.error || "Failed to update the book.");
      }

      setSuccess("Book updated successfully!");

      const updatedSlug =
        result.data && !Array.isArray(result.data)
          ? result.data.slug
          : formData.slug;

      // Refresh the list so the selector reflects the updated slug.
      const listResponse = await fetch(`${apiBaseUrl}/api/books`, {
        cache: "no-store",
      });

      if (listResponse.ok) {
        const listResult: ApiResponse = await listResponse.json();

        if (Array.isArray(listResult.data)) {
          setBooks(listResult.data);
        }
      }

      setSelectedSlug(updatedSlug);
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

          <h1 className="text-3xl font-bold">Edit a Book</h1>

          <p className="mt-2 text-gray-600">
            Select a book, update its information, and save your changes.
          </p>
        </div>

        <div className="space-y-6 rounded-xl bg-white p-6 shadow-md sm:p-8">
          {/* Messages */}
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

          {/* Book Selector */}
          <div>
            <label htmlFor="bookSelector" className="mb-2 block font-medium">
              Select a Book *
            </label>

            <select
              id="bookSelector"
              value={selectedSlug}
              onChange={handleBookSelection}
              disabled={loadingBooks || saving}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
            >
              <option value="">
                {loadingBooks ? "Loading books..." : "Choose a book"}
              </option>

              {books.map((book) => (
                <option key={book._id ?? book.slug} value={book.slug}>
                  {book.title}
                </option>
              ))}
            </select>

            {!loadingBooks && books.length === 0 && !error && (
              <p className="mt-2 text-sm text-gray-500">
                No books were found. Add a book before editing it.
              </p>
            )}
          </div>

          {loadingBook && (
            <p className="text-sm text-gray-500">Loading selected book...</p>
          )}

          {/* Edit Form */}
          {selectedSlug && !loadingBook && (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                        previous.slug === generateSlug(previous.title)
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
                  Used in the book URL. Use lowercase letters, numbers, and
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
                <label
                  htmlFor="publishedDate"
                  className="mb-2 block font-medium"
                >
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
                  Enter a path such as /images/books/my-book.jpg.
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
                  value={formData.externalUrl ?? ""}
                  onChange={handleChange}
                  placeholder="https://example.com/my-book"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Buttons */}
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
          )}
        </div>
      </div>
    </main>
  );
}
