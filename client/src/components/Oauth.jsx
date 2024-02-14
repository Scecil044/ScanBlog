import { Button } from "flowbite-react";
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import {
  authPendingState,
  authFulfilledState,
  authRejectedState,
} from "../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Oauth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError } = useSelector((state) => state.auth);

  const continueWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const result = await signInWithPopup(auth, provider);
    try {
      dispatch(authPendingState());
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          displayName: result.user.displayName,
          email: result.user.email,
          profilePicture: result.user.photoURL,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(authRejectedState(data.message));
        return;
      }
      dispatch(authFulfilledState(data));
      navigate("/");
    } catch (error) {
      dispatch(authRejectedState(error.message));
      console.log("could not login with google", error);
    }
  };
  return (
    <Button
      onClick={continueWithGoogle}
      type="button"
      outline
      gradientDuoTone="pinkToOrange"
      className="mt-4"
    >
      <FaGoogle className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
}
