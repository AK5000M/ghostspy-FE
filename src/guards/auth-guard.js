import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAuthContext } from "src/contexts/auth-context";
import jsCookie from "js-cookie";

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);
  const token = jsCookie.get("token"); // Obtenha o token do jsCookie

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (ignore.current) {
      return;
    }

    ignore.current = true;

    if (!token) {
      // Verifique se o token não existe
      console.log("Token does not exist, redirecting to login");
      router
        .replace({
          pathname: "/auth/login",
          query: router.asPath !== "/auth/login" && { continueUrl: router.asPath },
        })
        .catch(console.error);
    } else {
      setChecked(true);
    }
  }, [router.isReady]);

  if (!checked) {
    return null;
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
