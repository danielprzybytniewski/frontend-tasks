import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchUserProps {
  search: string;
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: () => void;
  handleClearSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export default function SearchUser({
  search,
  searchInput,
  setSearchInput,
  handleSearch,
  handleClearSearch,
  handleKeyPress,
}: SearchUserProps) {
  return (
    <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="searchInput"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search by name..."
            className="focus-visible:ring-0"
          />
        </div>
        <Button
          disabled={!searchInput}
          onClick={handleSearch}
          className="transition-colors duration-200 hover:cursor-pointer hover:bg-gray-700"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        {search && (
          <Button
            variant="outline"
            onClick={handleClearSearch}
            className="transition-colors duration-200 hover:cursor-pointer"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
