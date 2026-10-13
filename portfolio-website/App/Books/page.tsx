import FlipCard from "@/Components/Cards/flip-card";

const books = [
  {
    title: "Blazing Ruin",
    image: "/Public/Images/Books/BlazingRuin.jpg",
    summary:
      "A young man is trapped among shattered mirrors and glowing red threads, surrounded by haunting reflections of his suffering. Bound by forces he struggles to escape, his pain transforms into anger and determination. “Blazing Ruin” represents the destruction within him—and the power rising from it.",
    href: "#",
  },
  {
    title: "Honey Blossom",
    image: "/Public/Images/Books/HoneyBlossom.jpg",
    summary:
      "After being abandoned by the woman he loved, Noah moves to Phoenix Elysium with his newborn daughter to start over. In a city known for new beginnings, he learns that losing the life he dreamed of doesn't mean losing his chance at happiness. As Noah raises his daughter alone, he discovers that family, love, and hope can bloom in the most unexpected places.",
    href: "#",
  },
];

export default function BooksPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/*Header*/}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font bold">My Books</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Explore my collection of books that I&apos;ve written or am currently
            working on
          </p>
        </div>
        <br />
        {/* Book Cards */}
        <section className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <FlipCard
              key={book.title}
              title={book.title}
              image={book.image}
              summary={book.summary}
              href={book.href}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
