import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="container mx-auto w-full px-4 py-10 margin-y">
      <div className="mb-6">
        <h1 className="font-poppins text-2xl font-semibold text-[#010806]">
          Admin Area
        </h1>
        <p className="mt-2 font-poppins text-[#6B7280]">
          Shared admin layout
        </p>
      </div>
      {children}
    </main>
  );
}
