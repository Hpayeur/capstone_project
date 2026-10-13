export default function Footer() {
  return (
    <footer>
      <div>
        <p>
          &copy; {new Date().getFullYear()} @ 2026 / Hailee Payeur
          <a href="https://tooeletech.edu" target="_blank">
            Tooele Technical College
          </a>
          <br />
          Last Updated: {new Date().toLocaleDateString()}
        </p>
        <div>
          <a
            href="https://github.com/Hpayeur"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
