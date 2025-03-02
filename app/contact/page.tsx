"use client";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useRouter } from "next/navigation";

export default function Contact() {
  const words = [
    {
      text: "Made",
    },
    {
      text: "by",
    },
    {
      text: "Maksym",
    },
    {
      text: "Yemelianenko",
    },
    {
      text: "and",
    },
    {
      text: "George",
    },
    {
      text: "Sirichartchai",
    },
  ];
  const history = useRouter();
  return (
    <div className="z-10 relative flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
        Your smart decisions start here.
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="cursor-pointer z-100 w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm" onClick={() => history.push("https://www.linkedin.com/in/maksym-yemelianenko/")}>
            Maksym's LinkedIn
        </button>
        <button className="z-100 w-40 h-10 rounded-xl bg-white text-black border border-black cursor-pointer text-sm" onClick={() => window.open("https://www.linkedin.com/in/george-s-061569252/")}>
            George's LinkedIn
        </button>
      </div>
    </div>
  );
}
