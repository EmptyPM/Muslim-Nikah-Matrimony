import React from "react";
import Image from "next/image";

type SafetyCardProps = {
  iconSrc: string;
  title: string;
  description: string;
};
const SafetyCard = ({ iconSrc, title, description }: SafetyCardProps) => {
  return (
    <div className="relative mx-auto w-full max-w-[315px]  ">
      <div className="relative">
        <svg
          viewBox="0 0 315 277"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <rect width="315" height="277" rx="25" fill="#397466" />
        </svg>

        <div className="relative z-10 flex h-full flex-col px-7 pb-10 pt-7">
          <div className="h-11 w-11 lg:h-14 lg:w-14">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-white">
              <Image
                src={iconSrc}
                alt=""
                width={22}
                height={22}
                className="h-[22px] w-[22px] lg:h-[28px] lg:w-[28px] object-contain"
                aria-hidden
              />
            </div>
          </div>

          <h3 className="mt-4 font-poppins  font-medium subtitle text-white h-auto lg:h-15 xl:h-auto ">
            {title}
          </h3>
          <p className="mt-3 font-aref-ruqaa-ink paragraph text-white h-auto lg:h-20 ">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyCard;

