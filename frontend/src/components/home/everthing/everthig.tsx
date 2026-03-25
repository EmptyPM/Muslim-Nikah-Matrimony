import React from "react";
import Image from "next/image";
import EverythingFourCards from "@/components/home/everthing/4cards";

const EverythingSection = () => {
  return (
    <section className="w-full bg-[#E6EEEC] margin-y py-10">
      <div className="containerpadding container mx-auto">
        <div className="flex flex-col items-center text-center gap-4">
          <Image
            src="/images/your-journey/top.png"
            alt="Ornament"
            width={80}
            height={80}
            className="object-contain"
          />

          <p className="text-[#02100D] font-andada-pro title-sub-top font-light max-w-4xl">
            Secure, private, and faith-guided matchmaking for families
          </p>

          <h2 className="title font-poppins font-medium text-[#010806] leading-tight max-w-4xl">
            Everything You Need for
            <br />
            a{" "}
            <span className="font-aref-ruqaa-ink font-bold text-[#DB9D30]">
              Blessed
            </span>{" "}
            Match
          </h2>
        </div>

        <div className="mt-12 w-full">
          <EverythingFourCards />
        </div>
      </div>
    </section>
  );
};

export default EverythingSection;
