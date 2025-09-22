import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Search } from "lucide-react"
import React, { useState } from "react"

interface SearchInputProps {
  onSearch: (val: string) => void
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const [value, setValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value) // send the current input value up
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-[40px] w-full items-center space-x-2 mt-1">
      <div className="relative w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-8"
          id="search-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Button type="submit" variant="default" className="hover:bg-[rgba(104,129,153,0.25)] hover:scale-105 transition-transform w-[90px] h-[40px] rounded-[9px] p-[12px_15px] bg-[rgba(104,129,153,0.15)] cursor-pointer transition-colors transition-transform duration-200 ease-linear">
        Filter
      </Button>
    </form>
  )
}
