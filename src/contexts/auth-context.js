import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import jsCookie from "js-cookie";
import { useRouter } from "next/router";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.userData;
    const devices = action.devicesData;
    const apps = action.appData;

    return {
      ...state,
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
            devices,
            apps,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user: user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const router = useRouter();
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // if (initialized.current) {
    //   return;
    // }

    initialized.current = true;

    let isAuthenticated = false;
    const existingToken = jsCookie.get("token");
    const userId = jsCookie.get("userId");

    if (existingToken && userId) {
      isAuthenticated = true;

      const response = await fetch(`${apiUrl}/user/get/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + existingToken,
        },
      });

      if (response.status == "200") {
        const userInfo = await response.json();

        dispatch({
          type: HANDLERS.INITIALIZE,
          userData: userInfo.data.userInfo,
          devicesData: userInfo.data.devices,
          appData: userInfo.data.apps,
        });
      } else {
        jsCookie.remove("token");
        jsCookie.remove("userId");
        window.location.href = "/auth/login";
      }
    }

    dispatch({
      type: HANDLERS.INITIALIZE,
    });
  };

  useEffect(() => {
    // window.location.href = "/home";
    initialize();
  }, [router?.pathname]);

  // SignIn function with api
  const SignIn = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const authData = await response.json();

      if (authData.status === "201") {
        jsCookie.set("token", authData.data.token, { expires: 10 * 60 * 60 * 1000 });
        jsCookie.set("userId", authData.data.user._id, { expires: 10 * 60 * 60 * 1000 });
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: authData.data.user,
        });
        return authData;
      } else if (authData.status === "401") {
        // Handle unauthorized response
        // Redirect to login or show an appropriate message
        window.location.href = "/auth/login?message=sessionExpired";
      } else {
        return authData;
      }
    } catch (error) {
      throw new Error(error.message || "Failed to sign in");
    }
  };

  // SignUp function with api
  const SignUp = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.status == "201") {
        jsCookie.set("token", responseData.data.token, { expires: 10 * 60 * 60 * 1000 });
        jsCookie.set("userId", responseData.data.user._id, { expires: 10 * 60 * 60 * 1000 });

        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: responseData.data.user,
        });

        return responseData;
      } else {
        return responseData;
      }
    } catch (error) {
      throw new Error(error.message || "Failed to sinUp");
    }
  };

  // Forgot Password function with api
  const ForgotPassword = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      return responseData;
    } catch (error) {
      throw new Error(error.message || "Failed to ForgotPassword");
    }
  };

  // SignOut Function
  const SignOut = () => {
    jsCookie.remove("token");
    jsCookie.remove("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("lock");
    localStorage.removeItem("black");

    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        SignIn,
        SignUp,
        ForgotPassword,
        SignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
