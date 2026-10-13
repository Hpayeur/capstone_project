import FlipCard from "@/Components/Cards/flip-card";

const projects = [
  {
    title: "Finance Tracker",
    image: "/Public/Images/Projects/finance-tracker.jpg",
    summary:
      "A financial tracking application built with React, Firebase, Tailwind CSS, Java, and HTML. The application allows users to track their income, expenses, and overall financial activity. Firebase is used for storing and managing financial data, while React and Tailwind CSS provide an interactive and responsive interface.",
    href: "#",
  },
  {
    title: "Memory Game",
    image: "/Public/Images/Projects/Memory-Game.jpg",
    summary:
      "A simple dog-themed memory matching game built with HTML, CSS, and JavaScript. Players flip cards to find matching pairs of dog images. The game uses JavaScript to handle card flipping, matching, and game logic, while CSS creates the layout and visual design.",
    href: "#",
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen px-6" py-16>
      <div className="mx-auto max-w-7xl">
        {/* Projects Page Header*/}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold"> My Different Work Projects</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {" "}
            Explore My different Projects that i have created and designed
          </p>
        </div>
        {/* Projects Cards */}
        <section className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-3">
          {projects.map((project) => (
            <FlipCard
              key={project.title}
              title={project.title}
              image={project.image}
              summary={project.summary}
              href={project.href}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
