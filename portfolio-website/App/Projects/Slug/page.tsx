import Image from "next/image";
import Link from "next/link";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const projects = [
  {
    title: "Finance Tracker",
    slug: "fiance-tracker",
    image: "/Public/Images/Projects/finance-tracker.jpg",
    summary:
      "A financial tracking application built with React, Firebase, Tailwind CSS, Java, and HTML. The application allows users to track their income, expenses, and overall financial activity. Firebase is used for storing and managing financial data, while React and Tailwind CSS provide an interactive and responsive interface.",
    description:
      "A financial tracker is an application that helps users manage their money by recording income, tracking expenses, monitoring spending habits, and keeping an overview of their overall financial activity.",
    technologies: [
      "React",
      "Firebase",
      "Tailwind CSS",
      "JavaScript",
      "HTMl",
      "CSS",
    ],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Memory Game",
    slug: "memory-game",
    image: "/Public/Images/Projects/Memory-Game.jpg",
    summary:
      "A simple dog-themed memory matching game built with HTML, CSS, and JavaScript. Players flip cards to find matching pairs of dog images. The game uses JavaScript to handle card flipping, matching, and game logic, while CSS creates the layout and visual design.",
    description:
      "A Memory Game is a fun matching game where players flip cards to find matching pairs. The goal is to remember the location of each card and match all the pairs using as few attempts as possible.",
    technologies: ["HTML", "CSS", "JavaScript"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  const project = projects.find((item) => item.slug === slug);
  if (!project) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold">These Projects are not Found</h1>
          <p className="mt-4 text-gray-600">
            The projects you are looking for does not exist.
          </p>
          <Link
            href="/projects"
            className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
          >
            Lets get Back to the Projects
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Back to Projects */}
        <Link
          href="/projects"
          className="mb-8 inline-block text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          lets Get Back To The Projects
        </Link>
      </div>
      {/* Projects */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        {/* Project Image */}
        <div className="relative aspect-video w-full bg-gray-100">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
        {/* Project Information */}
        <div className="p-8">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {project.summary}
          </p>
          {/* Project Description */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold">About This Project</h2>
            <p className="mt-4 leading-8 text-gray-600">
              {project.description}
            </p>
          </section>
          {/* technologies */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold">Technologies That Were Used</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                >
                  {technology}
                </span>
              ))}
            </div>
          </section>

          {/* Links to the Projects */}
          <div className="mt-8 flex flex-wrap gap-4">
            {project.liveUrl !== "#" && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
              >
                {" "}
                See the Live Projects
              </a>
            )}
            {project.githubUrl !== "#" && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-900 transition hover:bg-gray-100"
              >
                Lets View the GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
