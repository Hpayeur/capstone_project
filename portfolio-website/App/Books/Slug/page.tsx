import Image from "next/image";
import Link from "next/link";

interface BookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const books = [
  {
    title: "Blazing Ruin",
    slug: "Blazing-Ruin",
    image: "/Public/Images/Books/BlazingRuin.jpg",
    summary: "",
    description: `I'm no stranger to unwavering devastation. The breaking of hope and unwavering damnation. I've been through hell and back. The world that I believe to be so clear. So devastating beautiful full of love and hope. Yet in the end it was a dream. A false dream of life that was forever ripped away from me. To many I'm seen as weak, tiny, and someone that only needs to submit to what people believe. There first mistake is underestimating me............until now...

    The three ghosts the devils of the underground. Wyatt Vladimir, Ty Locked, and Artemis Stone. The names that control the shadows. There legacy and names that provide caution. Make many of there enemies wither to the ground with tails tucked between in fear. The grip over their territory harsh, unpredictable, unforgiving, and gripped so tightly. Yet now I've came across their Radar. A mystery they want to unravel, to play, and bend to their will. Well unfortunately for them I'm not some helpless omega they can toy with. Because I bite with the intent to draw blood....or to bring Unfortunate Ruin`,
    author: "Lunafire37",
    genre: "",
    publishedDate: "",
    externalUrl: "#",
  },
  {
    title: "Honey Blossom",
    slug: "Honey-Blossom",
    image: "/Public/Images/Books/HoneyBlossom.jpg",
    summary: "",
    description:
      "The beginning of a family is said to bring the greatest joy and honor of raising something so special. Yet for Noah it was a day his dreams died. For after a couple months the love of his life had abandoned him and his newborn. Devastated Noah moved to Phoenix Elysium with the only thing he had left. For it was a place that was said to bring back joy, Renew hopes, and rewrite your own story. ",
    author: "Lunafire37",
    genre: "",
    publishedDate: "",
    externalUrl: "#",
  },
];

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = books.find((item) => item.slug === slug);

  if (!book) {
    return (
      <main className="min-h-screen px-6  py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold">This book is not found</h1>
          <p className="mt-4 text-gray-600">
            This book that you are looking dor does not exist.
          </p>
          <link
            href="/books"
            className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
          >
            {" "}
            Back to Books
          </link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Back to The books */}
        <link
          href="/books"
          className="mb-8 inline-block text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Back to the Books{" "}
        </link>

        {/* Books Information */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <div className="grid md:grid-cols-2">
            {/* Books cover */}
            <div className="relative min-h-[500px] bg-gray-100">
              <Image
                src={book.image}
                alt={book.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Details about the books */}
            <div className="flex flex-col justify-center p-8">
              <h1 className="text-4xl font-bold">{book.title}</h1>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                {book.summary}
              </p>
              {/* More Details about the books */}
              <div className="mt-8 space-y-4">
                <h2 className="font-semibold">The Author</h2>
                <p className="text-gray-600">{book.author}</p>
              </div>
              <div>
                <h2 className="font-semibold"> Genre </h2>
                <p className="text-gray-600">{book.genre}</p>
              </div>
              <div>
                <h2 className="font-semibold"> Published </h2>
                <p className="text-gray-600">{book.publishedDate}</p>
              </div>
            </div>
            {/* External Book Link */}
            {book.externalUrl !== "#" && (
              <a
                href={book.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 text-center font-medium text-white transition hover:bg-gray-700"
              >
                Read or View Books
              </a>
            )}
          </div>
        </div>
        {/* Full Descriptions */}
        <div className="border-t border-gray-200 p-8">
          <h2 className="text-2xl font-bold">Information About this Book</h2>
          <p className="mt-4 leading-8 text-gray-600">{book.description}</p>
        </div>
      </div>
    </main>
  );
}
