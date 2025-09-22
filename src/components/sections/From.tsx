import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/Accordian";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchVaultsUpdated } from "../../api/vault-updated";
import { Button } from "../ui/Button";
import { z } from "zod";

// Vault validation schema
const vaultSchema = z.object({
    vault: z.string().min(1, "Vault name missing"),
    account: z.string().min(1, "Account missing"),
    avax: z.string().min(0, "AVAX amount missing or invalid"),
    price: z.string().min(1, "Price missing"),
});

type Vault = z.infer<typeof vaultSchema>;

type ButtonFilter = {
    name: string;
    count: number;
};

interface FromProps {
    onSendToStepper: (step: string) => void;
}

export default function From({ onSendToStepper }: FromProps) {
    const [activeSelect, selectActiveSelect] = useState<string>("");
    const [openAccordian, setOpenAccordian] = useState<string | null>(null);
    const [activeButtonFilter, setActiveButtonFilter] = useState<number | null>(null);
    const [buttonFilters, setButtonFilters] = useState<ButtonFilter[]>([]);
    const [filteredData, setFilteredData] = useState<Vault[]>([]);

    const { data: apiData = [], isLoading, isError } = useQuery<Vault[]>({
        queryKey: ["vaults"],
        queryFn: fetchVaultsUpdated,
    });

    useEffect(() => {
        if (!apiData.length) return;

        const vaultCountMap: Record<string, number> = { All: apiData.length };
        apiData.forEach((item) => {
            vaultCountMap[item.vault] = (vaultCountMap[item.vault] || 0) + 1;
        });

        const vaultCountArray: ButtonFilter[] = Object.entries(vaultCountMap).map(
            ([name, count]) => ({ name, count })
        );

        setButtonFilters(vaultCountArray);
        setFilteredData(apiData);
    }, [apiData]);

    const setActiveButtonClick = (label: string, index: number) => {
        setActiveButtonFilter(index);
        setFilteredData(label === "All" ? apiData : apiData.filter((item) => item.vault === label));
    };

    const onSelectVault = (item: Vault) => {
        const result = vaultSchema.safeParse(item);
        if (!result.success) {
            // Safely access first error, fallback to generic message
            const firstError = !result.success ? result.error.errors?.[0]?.message ?? "Invalid vault data" : undefined;

            // Optional: log all validation errors for debugging
            console.log("Validation errors:", result.error.format());
            return;
        }
        selectActiveSelect(item.vault);
        setOpenAccordian(null);
    };

    return (
        <div
            id="from-section"
            onClick={() => onSendToStepper("from")}
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
                            <div className="text-xl font-semibold">From</div>
                            <div className="ml-[165px] text-base">
                                {!activeSelect ? "Select source" : activeSelect}
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent>
                        <div className="flex flex-col gap-3 pr-4 pl-4 pb-6 float-right w-[555px]">

                            {/* Filter Buttons - USED ID HERE for scroll logic in CSS file */}
                            <div id="button-row" className="bg-[#f4f4f6] rounded-[9px] p-[5px] flex flex-row border border-[#68819926] overflow-x-auto overflow-y-hidden whitespace-nowrap"> 
                                {buttonFilters.map((item, index) => (
                                    <Button
                                        key={index}
                                        className={`cursor-pointer px-2.5 py-1.5 rounded-lg font-bold transition-all duration-200 ${
                                            activeButtonFilter === index
                                                ? "bg-[#cbdcea] text-[#05294c] hover:bg-[#b0d1e5]"
                                                : "bg-transparent text-[#688199] hover:bg-[#d9e8f7] hover:text-[#05294c]"
                                            }`}
                                        onClick={() => setActiveButtonClick(item.name, index)}
                                    >
                                        {item.name}
                                        <span className="ml-1 bg-[#90a0ae] text-white text-xs font-normal rounded-md px-1.5 py-0.5">
                                            {item.count}
                                        </span>
                                    </Button>
                                ))}
                            </div>

                            {/* Vault List */}
                            {filteredData.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => onSelectVault(item)}
                                    className="flex justify-between items-center bg-[#f4f5f5] rounded-lg p-2.5 font-semibold text-base hover:bg-white cursor-pointer"
                                >
                                    <div className="flex flex-col">
                                        <div>{item.account}</div>
                                        <div className="font-normal text-[#688199]">{item.vault}</div>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <div>{item.avax}</div>
                                        <div className="font-normal text-[#688199]">{item.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
