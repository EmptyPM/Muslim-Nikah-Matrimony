import React from "react";
import Image from "next/image";
import GenuineProfileCards from "@/components/home/genuine/card";

const GenuineSection = () => {
  return (
    <section className="w-full bg-[#E6EEEC] margin-y py-10">
      <div className="containerpadding container mx-auto">
        {/* Title block (same style as about.tsx / safety/header.tsx) */}
        <div className="flex flex-col items-center text-center gap-4">
          <Image
            src="/images/your-journey/top.png"
            alt="Ornament"
            width={80}
            height={80}
            className="object-contain"
          />

          <p className="text-[#02100D] font-andada-pro title-sub-top font-light max-w-4xl">
            Each profile is verified to maintain trust, privacy, and meaningful
            connections
          </p>

          <h2 className="title font-poppins font-medium text-[#010806] leading-tight max-w-4xl">
            Genuine Profiles for
            <br />
            Meaningful{" "}
            <span className="font-aref-ruqaa-ink font-bold text-[#DB9D30]">
              Matches
            </span>
          </h2>
        </div>

        {/* Profiles grid  */}
        <div className="mt-12">
          <GenuineProfileCards />
        </div>
      </div>
    </section>
  );
};

export default GenuineSection;
