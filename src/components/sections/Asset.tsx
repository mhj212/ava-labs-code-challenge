import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../ui/Accordian";
  import React, { useState } from "react";
  import { useQuery } from "@tanstack/react-query";
  import { fetchAssets } from "../../api/assets";
  import { Spinner } from "../ui/Spinner";
  import errorSvg from "../../svg/error.svg";
  
  import SearchInput from "../ui/SearchInput";
  
  interface AssetProps {
    onSendToStepper: (step: string) => void;
  }
  
  interface AssetType {
    symbol: string;
    coinGeckoId: string;
    logoUri: string;
  }
  
  export default function Asset({ onSendToStepper }: AssetProps) {
    const [openAccordian, setOpenAccordian] = useState<string | null>(null);
    const [activeAsset, selectActiveAsset] = useState<AssetType | null>(null);
    const [search, setSearch] = useState<string>("");
  
    const { data: apiData = [], isLoading, isError } = useQuery<AssetType[]>({
      queryKey: ["assets"],
      queryFn: fetchAssets,
    });
  
    const onClickAsset = (item: AssetType) => {
      selectActiveAsset(item);
      setOpenAccordian(null);
    };
  
    const renderAssetsTitle = () => {
      if (isError) {
        return <div className="text-red-500 text-base">Error loading assets</div>;
      }
      if (isLoading) {
        return <div className="text-[#688199] text-base">Loading Assets...</div>;
      }
      if (!activeAsset) {
        return <div className="text-base">Select asset</div>;
      }
      return (
        <div className="absolute top-2 flex w-full items-center space-x-2">
          <img
            src={activeAsset.logoUri}
            alt={activeAsset.symbol}
            className="w-8 h-8 relative top-0.5"
          />
          <div className="flex flex-col">
            <div>{activeAsset.symbol}</div>
            <div className="font-normal">{activeAsset.coinGeckoId}</div>
          </div>
        </div>
      );
    };
  
    const filteredAssets = apiData.filter(
      (item) =>
        item.symbol.toLowerCase().includes(search.toLowerCase()) ||
        item.coinGeckoId.toLowerCase().includes(search.toLowerCase())
    );
  
    return (
      <div
        id="asset-section"
        onClick={() => onSendToStepper("asset")}
        className="relative group"
      >
        <Accordion
          type="single"
          collapsible
          className="bg-[#edeef0] rounded-xl border border-[#e8ecf0]"
          value={openAccordian}
          onValueChange={(val: string | null) => setOpenAccordian(val)}
        >
          <AccordionItem value="item-1" className="transition-shadow data-[state=open]:shadow-lg">
            <AccordionTrigger>
              <div className="flex items-center justify-between px-6 py-4 relative">
                <div className="text-xl items-center font-semibold">
                  Asset
                </div>
                <div className="ml-[160px]">{renderAssetsTitle()}</div>
                {isLoading && (
                  <div className="group-hover:bg-white absolute right-[-370px] z-50 bg-[#edeef0]">
                    <Spinner />
                  </div>
                )}
                {isError && (
                  <div className="group-hover:bg-white absolute right-[-353px] z-50 bg-[#edeef0]">
                    <img className="w-5 h-5" src={errorSvg} alt="Error" />
                  </div>
                )}
              </div>
            </AccordionTrigger>
  
            <AccordionContent>
              <div
                className="flex flex-col w-[565px] gap-3 pr-4 pl-4 pb-6 float-right"
              >
                <SearchInput onSearch={setSearch} />
                {filteredAssets.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => onClickAsset(item)}
                    className="hover:bg-white hover:cursor-pointer hover:rounded-[9px] flex justify-between items-center bg-[#f4f5f5] rounded-lg p-2.5 hover:bg-white cursor-pointer font-semibold text-base"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={item.logoUri}
                        alt={item.symbol}
                        className="w-8 h-8 relative top-0.5"
                      />
                      <div className="flex flex-col">
                        <div>{item.symbol}</div>
                        <div className="font-normal">{item.coinGeckoId}</div>
                      </div>
                    </div>
                    <div className="flex flex-col text-right">
                      <div>24.38 {item.symbol}</div>
                      <div className="font-normal text-[#688199]">$876.72</div>
                    </div>
                  </div>
                ))}
                {filteredAssets.length === 0 && (
                  <div className="text-gray-400 text-center py-4">No assets found</div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
  