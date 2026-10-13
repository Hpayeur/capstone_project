"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface FlipCardProps {
  title: string;
  image: string;
  summary: string;
  href: string;
}

export default function FlipCard({
  title,
  image,
  summary,
  href,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => {
    setIsFlipped((current) => !current);
  };
  return (
    <div
      className="group h-105 w-full max-w-sm cursor-pointer perspective-[1000px]"
      onClick={handleFlip}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleFlip();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title}`}
      aria-pressed={isFlipped}
    >
      {" "}
      <div
        className={`relative h-full w-full transition-transform duration-700 transform-3d ${isFlipped ? "transform-[rotateY(180deg)]" : ""}`}
      >
        {" "}
        {/* Cards Front */}{" "}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg backface-hidden">
          {" "}
          <div className="relative h-full w-full">
            {" "}
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-cover"
            />{" "}
            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-5">
              {" "}
              <h2 className="text-2xl font-bold text-white"> {title} </h2>{" "}
              <p className="mt-1 text-sm text-white/80">
                {" "}
                Click to learn more{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Cards Back */}{" "}
        <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-900 p-6 text-center shadow-lg backface-hidden transform-[rotateY(180deg)]">
          {" "}
          <h2 className="text-2xl font-bold text-white"> {title} </h2>{" "}
          <p className="mt-4 text-base leading-relaxed text-gray-300">
            {" "}
            {summary}{" "}
          </p>{" "}
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="mt-8 rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {" "}
            View More{" "}
          </Link>{" "}
          <p className="mt-4 text-xs text-gray-400">
            {" "}
            Click the card to flip back{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
