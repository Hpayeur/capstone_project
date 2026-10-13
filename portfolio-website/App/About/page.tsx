export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">All About Me</h1>
        <p className="mt-6 text-lg leading-8 text-gray-700">
          Hello Everyone! Welcome to my personal Blog Portfolio website. This
          website will be full of verious Artwork, Books, and projects that i
          have Created. I will be posting my Artwork, Books, and Projects on
          this website. I will also be sharing my thoughts and ideas on this
          website. I hope you enjoy my website and find it useful.
        </p>
        <br />
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">My creative work</h2>
          <p className="mt-4 leading-10 text-gray-600">
            I will be using this portfolio to showcase my creatvity and
            technical projects that i have created or made throughout the years.
            It will also show my improvement over the years. You will be able to
            explore my books, view my artwork and learn more about my projects
            that i have created.
          </p>
        </section>
        <br />
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">
            {" "}
            What you Can Expect and Find on the website
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-600">
            <li>Written book content</li>
            <li>Visual Artwork & Creative projects</li>
            <li>Web Development Projects</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
