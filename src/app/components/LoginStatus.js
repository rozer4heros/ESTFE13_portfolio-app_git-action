"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginStatus() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    })();
  }, [supabase.auth]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }

    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {user ? (
        <button type="button" className="btn btn-error btn-danger" onClick={handleLogout}>
          Sign Out
        </button>
      ) : (
        <>
          <Link href="/login">로그인</Link>
          <Link href="/register">회원가입</Link>
        </>
      )}
    </>
  );
}
