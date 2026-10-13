import FlipCard from "@/Components/Cards/flip-card";

const artwork = [
  {
    title: "Burning Ruin",
    image: "@/Public/Images/Artwork/Burning-Ruin.jpg",
    summary:
      "A  young man stands trapped among shattered glass and tangled red threads, tears streaming as he struggles against the forces binding him. Surrounded by swirling pink and golden flames, he embodies pain, resistance, and the beginning of his own ruin.",
    href: "#",
  },
  {
    title: "Who's the imposter?",
    image: "@/Public/Images/Artwork/Whos-the-imposter.jpg",
    summary:
      "A colorful hand-drawn character poster titled “Who is the Imposter?”, featuring a group of unique characters with different appearances and personalities. The characters are arranged around the title, creating a playful mystery theme centered on figuring out which one is the imposter.",
    href: "#",
  },
  {
    title: "When trust becomes a weapon",
    image: "@/Public/Images/Artwork/When-trust-becomes-a-weapon.jpg",
    summary:
      "A captain recounts the tragic fate of their crew, revealing that trusted friends and family betrayed them. Four crew members were killed, while the survivors were hunted down by the three merciless perpetrators. The story ends with the heartbreaking realization that the crew was murdered by people they once trusted and loved.",
    href: "#",
  },
];

export default function ArtworkPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      {" "}
      <div className="mx-auto max-w-7xl">
        {" "}
        {/* Page Header */}
        <br />
        <div className="mb-12 text-center">
          {" "}
          <h1 className="text-4xl font-bold"> My Artwork </h1>{" "}
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {" "}
            Come Explore my Artwork creations and Artwork Pieces{" "}
          </p>{" "}
        </div>{" "}
        <br />
        {/* My Artwork Cards */}
        <section className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {" "}
          {artwork.map((piece) => (
            <FlipCard
              key={piece.title}
              title={piece.title}
              image={piece.image}
              summary={piece.summary}
              href={piece.href}
            />
          ))}{" "}
        </section>{" "}
      </div>{" "}
    </main>
  );
}
