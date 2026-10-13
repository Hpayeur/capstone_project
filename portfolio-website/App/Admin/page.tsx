export default function AdminPage() {
  return (
    <main>
      <section>
        <h1>Admin Dashboard</h1>
        <p>
          This is Where you can manage your books, artworks, and projects from
          your portfolio.
        </p>
      </section>

      <section>
        <h2> Content Management </h2>
        <div>
          <div>
            <h3> Books </h3>
            <p> You can Manage your Books and Written Works. </p>
          </div>

          <div>
            <h3> Artwork </h3>
            <p>
              {" "}
              You can Manage your Creative Art Pieces and Creative
              Artworks.{" "}
            </p>
          </div>

          <div>
            <h3> Projects </h3>
            <p>
              {" "}
              You can Manage your web projects or Even programming Projects.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
