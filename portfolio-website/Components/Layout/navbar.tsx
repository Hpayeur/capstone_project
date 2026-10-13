import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <div>
        <Link href="/">Portfolio Blog Website</Link>
        <div>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/books">Books</Link>
          <Link href="/artworks">Artworks</Link>
          <Link href="/projects">Projects</Link>
        </div>
      </div>
    </nav>
  );
}
