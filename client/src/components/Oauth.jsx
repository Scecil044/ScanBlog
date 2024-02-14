import { Button } from "flowbite-react";
import { FaGoogle } from "react-icons/fa";

export default function Oauth() {
  return (
    <Button
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
