import { NextPage } from "next";
import Link from "next/link";

const Nav: NextPage = () => {
  return (
    <nav>
      <ul className="flex items-center justify-between p-8">
        <li>
          <Link href="/">
            <a className="text-blue-500 no-underline text-accent-1 dark:text-blue-300">
              AGENDA-NEXT
            </a>
          </Link>
        </li>
        <ul className="flex items-center justify-between space-x-4">
          <li>
            <Link href="/profile">
              <a className="no-underline btn-blue">Profile</a>
            </Link>
          </li>
          <li>
            <Link href="/search">
              <a className="no-underline btn-blue">Search</a>
            </Link>
          </li>
        </ul>
      </ul>
    </nav>
  );
};

export default Nav;
