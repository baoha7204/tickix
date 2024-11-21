import Link from "next/link";

const Header = ({ isAuth }) => {
  const links = [
    !isAuth && { label: "Sign In", href: "/auth/signin" },
    !isAuth && { label: "Sign Up", href: "/auth/signup" },
    isAuth && { label: "Sign Out", href: "/auth/signout" },
  ].filter(Boolean);
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
          Tickix
        </Link>

        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center gap-2">
            {links.map(({ label, href }) => (
              <li key={href} className="nav-item">
                <Link href={href} className="nav-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
