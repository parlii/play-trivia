import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="bg-gray-100 dark:bg-gray-800 py-6 px-8">
      <ul className="flex space-x-6">
        <li>
          <Link
            href="/"
            className="text-gray-900 dark:text-gray-200 hover:text-blue-500"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/leaderboard"
            className="text-gray-900 dark:text-gray-200 hover:text-blue-500"
          >
            Leaderboard
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
