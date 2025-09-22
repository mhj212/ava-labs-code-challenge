import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/Accordian";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAddressesForVault, networkToVaultToAddresses } from "../../api/addresses";
import SearchInput from "../ui/SearchInput";
import { Button } from "../ui/Button";
import { z } from "zod";

// Button filter type
interface ButtonFilter {
  label: string;
  count: number;
}

// Initial button filters
const buttonFiltersSetup: ButtonFilter[] = [
  { label: "All", count: 0 },
  { label: "Vaults", count: 0 },
  { label: "Internal Whitelist", count: 0 },
  { label: "External Whitelist", count: 0 },
];

// Zod schema for an address item
const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  isVault: z.boolean(),
  isExternal: z.boolean(),
});

type AddressItem = z.infer<typeof addressSchema>;

interface ToProps {
  onSendToStepper: (step: string) => void;
}

export default function To({ onSendToStepper }: ToProps) {
  const [filteredData, setFilteredData] = useState<AddressItem[]>([]);
  const [activeSelect, selectActiveSelect] = useState<string>("");
  const [openAccordian, setOpenAccordian] = useState<string | null>(null);
  const [activeButtonFilter, setActiveButtonFilter] = useState<number | null>(null);
  const [buttonFilters, setButtonFilters] = useState<ButtonFilter[]>(buttonFiltersSetup);
  const [search, setSearch] = useState<string>("");

  // Fetch all addresses
  const fetchAllAddresses = async (): Promise<AddressItem[]> => {
    const promises = Object.entries(networkToVaultToAddresses).flatMap(
      ([networkId, vaults]) =>
        Object.keys(vaults).map(async (vaultId) => {
          try {
            return await fetchAddressesForVault(networkId, vaultId);
          } catch (err) {
            console.error(`Failed to fetch ${networkId} - ${vaultId}`, err);
            return [];
          }
        })
    );

    const results = await Promise.all(promises);
    return results.flat();
  };

  const { data: apiData = [], isLoading, isError } = useQuery<AddressItem[]>({
    queryKey: ["addresses"],
    queryFn: fetchAllAddresses,
  });

  useEffect(() => {
    if (!apiData.length) return;

    try {
      const validatedData: AddressItem[] = apiData.map((item) => addressSchema.parse(item));

      const copy = [...buttonFilters];
      copy[0].count = validatedData.length;
      copy[1].count = validatedData.filter((i) => i.isVault).length;
      copy[2].count = validatedData.filter((i) => !i.isVault && !i.isExternal).length;
      copy[3].count = validatedData.filter((i) => !i.isVault && i.isExternal).length;
      setButtonFilters(copy);

      setFilteredData(validatedData);
    } catch (err: any) {
      console.error("Validation error:", err);
    }
  }, [apiData]);

  const setActiveButtonClick = (label: string, index: number) => {
    setActiveButtonFilter(index);

    switch (label) {
      case "All":
        setFilteredData(apiData);
        break;
      case "Vaults":
        setFilteredData(apiData.filter((item) => item.isVault));
        break;
      case "Internal Whitelist":
        setFilteredData(apiData.filter((item) => !item.isVault && !item.isExternal));
        break;
      case "External Whitelist":
        setFilteredData(apiData.filter((item) => !item.isVault && item.isExternal));
        break;
    }
  };

  const displayedData = filteredData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      id="to-section"
      onClick={() => onSendToStepper("to")}
      className="relative"
    >
      <Accordion
        type="single"
        collapsible
        value={openAccordian}
        onValueChange={(val) => setOpenAccordian(val)}
        className="bg-[#edeef0] rounded-xl border border-[#e8ecf0]"
      >
        <AccordionItem value="item-1" className="transition-shadow data-[state=open]:shadow-lg">
          <AccordionTrigger>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-xl font-semibold">To</div>
              <div className="ml-[188px] text-base">
                {!activeSelect ? "Select destination" : activeSelect}
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col gap-3 pr-4 pl-4 pb-6 h-[670px] w-[565px] float-right">
              <SearchInput onSearch={setSearch} />

              {/* Filter Buttons */}
              <div className="flex whitespace-nowrap bg-[#f4f4f6] border border-[#68819926] rounded-lg p-1">
                {buttonFilters.map((item, index) => (
                  <Button
                    key={index}
                    className={`px-2.5 py-1.5 rounded-lg font-bold transition-all duration-200 ${
                      activeButtonFilter === index
                        ? "bg-[#cbdcea] text-[#05294c] hover:bg-[#b0d1e5]"
                        : "bg-transparent text-[#688199] hover:bg-[#d9e8f7] hover:text-[#05294c]"
                    }`}
                    onClick={() => setActiveButtonClick(item.label, index)}
                  >
                    {item.label}
                    <span className="ml-1 bg-[#90a0ae] text-white text-xs font-normal rounded-md px-1.5 py-0.5">
                      {item.count}
                    </span>
                  </Button>
                ))}
              </div>

              {/* Address List */}
              <div className="flex flex-col gap-3 overflow-y-auto">
                {displayedData.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      selectActiveSelect(item.name);
                      setOpenAccordian(null);
                    }}
                    className="bg-[#f4f5f5] p-2.5 rounded-lg font-semibold text-base hover:bg-white cursor-pointer"
                  >
                    {item.name}
                  </div>
                ))}
                {displayedData.length === 0 && (
                  <div className="text-gray-400 text-center py-4">No results found</div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
