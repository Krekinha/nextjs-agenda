import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/client";
import useSWR from "swr";

import apiSWR from "../utils/apiSwr";
import Nav from "../components/nav";

const ProfilePage: NextPage = () => {
  const [session, loading] = useSession();

  const { data, error } = useSWR(`/api/user/${session?.user.email}`, apiSWR);

  if (error) {
    console.log(error);
  }

  if (data) {
    console.log(data);
  }

  return (
    <div>
      <Nav />
      {!session && (
        <div className="text-3xl">
          Favor fazer login
          <br />
          <button onClick={() => signIn("auth0")}>Sign in</button>
        </div>
      )}
      {session && data && (
        <>
          <h1>Bem vindo {data.data.name} ao PERFIL</h1>
          <div className="text-3xl">
            Signed in as {data.data.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        </>
      )}
      {error && <h1>Usuário não cadastrado</h1>}
      {loading && (
        <div className="text-5xl">
          <h1>CARREGANDO</h1>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
