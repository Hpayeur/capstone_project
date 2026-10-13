import Image from "next/image";
import Link from "next/link";

interface ArtworksPageProps {
  params: Promise<{
    slug: string;
  }>;
}
const artwork = [
  {
    title: "Burning Ruin",
    slug: "Burning Ruin",
    artist: "Lunafire37",
    image: "/Public/Images/Artworks/Buring_Ruin.jpg",
    summary: "",
    description: `The image depicts a young man standing at the center of a fractured, chaotic world. He has light-colored hair and wears glasses, a dark jacket, and a deep blue tie. His face shows intense pain and distress, with tears visible in his eyes and his teeth clenched as if he is fighting to hold himself together.
    Behind him, the background is filled with shattered blue-and-white glass, creating the feeling of a broken reality or a life falling apart. Thin red threads twist around his body and stretch throughout the scene, symbolizing control, entrapment, manipulation, or the bonds he cannot easily escape.
    At the bottom, pink, orange, and golden flames or ribbons swirl around him, contrasting with the cold blue surroundings. They give the image a sense of something beautiful being consumed by destruction.`,
    dimensions: "",
    medium: "Colored Pencil and Graphite on paper",
    yearCreated: 2025,
    externalUrl: "#",
  },
  {
    title: "",
    slug: "",
    artist: "",
    image: "",
    summary: "",
    description: "",
    medium: "",
    yearCreated: "",
    externalUrl: "",
  },
];

export default async function ArtworkDetailPage({ params }: ArtworksPageProps) {
  const { slug } = await params;
  const piece = artwork.find((item) => item.slug === slug);

  if (!piece) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold">Artwork Not Found</h1>
          <p className="mt-4 text-gray-600">
            Artwork that you are looking for does not exist
          </p>
          <Link
            href="/artwork"
            className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
          >
            Back to Artwork
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Back card Link */}
        <Link
          href="/artwork"
          className="mb-8 inline-block text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Back to the Artwork
        </Link>
        {/*My Artwork*/}
        <div className="overflow-hidden rounded-2xl border border-b-gray-300 bg-white shadow-lg">
          <div className="relative aspect-video w-full">
            <Image
              src={piece.image}
              alt={piece.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
          {/*Artwork Info*/}
          <div className="p-8">
            <h1 className="text-4xl font-bold">{piece.title}</h1>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              {piece.summary}
            </p>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold">
                Information about the Artwork
              </h2>
              <p className="mt-3 leading-7 text-gray-600">
                {piece.description}
              </p>
            </div>
            {/* Artwork Details */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold">The Artist</h3>
                <p>{piece.artist}</p>
              </div>
              <div>
                <h3 className="font-semibold">
                  What types of medium is used for the Art piece
                </h3>
                <p className="text-gray-600">{piece.medium}</p>
              </div>
              <div>
                <h3 className="font-semibold">Dimensions of the Artwork</h3>
                <p className="text-gray-600">{piece.dimensions}</p>
              </div>
              <div>
                <h3 className="font-semibold">Year the artwork was Created</h3>
                <p className="text-gray-600">{piece.yearCreated}</p>
              </div>
            </div>
            {/*External Url Link*/}
            {piece.externalUrl !== "#" && (
              <a
                href={piece.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block round-lg bg-gray-900 py-3 font-medium text-white transition hover:bg-gray-700"
              >
                View The Original Artwork
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
