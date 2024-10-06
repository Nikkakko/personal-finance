"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
export default function SearchField({
  placeholder,
  className,
  query,
}: {
  query: string;
  placeholder: string;
  className?: string;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inside the Search Component...
  const handleSearch = useDebouncedCallback(term => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(query, term);
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <form className={cn("relative flex flex-1 flex-shrink-0", className)}>
      <Input
        className="peer block w-full rounded-md border  py-[9px] pl-10 text-sm outline-2  h-11"
        placeholder={placeholder}
        onChange={e => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </form>
  );
}
