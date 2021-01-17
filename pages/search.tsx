import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/client";

import Nav from "../components/nav";

const SearchPage: NextPage = () => {
  const [session, loading] = useSession();
  return (
    <div>
      <Nav />
      <div>Bem vindo a página SEARCH</div>
      <div>
        {!session && (
          <div className="text-3xl">
            Not signed in <br />
            <button onClick={() => signIn("auth0")}>Sign in</button>
          </div>
        )}
        {session && (
          <div className="text-3xl">
            Signed in as {session.user.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        )}
        {loading && (
          <div className="text-5xl">
            <h1>CARREGANDO</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
