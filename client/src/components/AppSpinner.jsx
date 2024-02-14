import { lineSpinner } from "ldrs";

lineSpinner.register();

export default function AppSpinner() {
  return (
    <div className="h-full w-full bg-black/50 fixed inset-0 flex items-center justify-center">
      <div>
        <l-line-spinner
          size="60"
          stroke="3"
          speed="1"
          color="white"
        ></l-line-spinner>
      </div>
    </div>
  );
}
