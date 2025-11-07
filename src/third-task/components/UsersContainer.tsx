import { KeyboardEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchUsers } from "@/third-task/api/users";
import AlertUser from "@/third-task/components/AlertUser";
import EditUser from "@/third-task/components/EditUser";
import SearchUser from "@/third-task/components/SearchUser";
import UsersPagination from "@/third-task/components/UsersPagination";
import UsersTable from "@/third-task/components/UsersTable";
import type { User } from "@/third-task/types/user.schema";

export default function UsersContainer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const perPage = 10;

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () => fetchUsers({ page, per_page: perPage, search }),
    retry: 1,
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mt-8 min-h-screen bg-slate-50 pb-2">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center">
          <h3 className="mb-2 text-3xl font-bold text-slate-900">Users</h3>
          <p className="text-slate-600">Users List from GoREST API</p>
        </div>
        <SearchUser
          search={search}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
          handleKeyPress={handleKeyPress}
        />
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div
              data-testid="loading-state"
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <p className="mb-2 text-red-600">Error loading data</p>
              <p className="text-sm text-slate-500">{error?.message}</p>
            </div>
          ) : (
            <>
              <UsersTable users={users} setEditingUser={setEditingUser} />
              {users && users.length > 0 && (
                <UsersPagination
                  page={page}
                  setPage={setPage}
                  users={users}
                  perPage={perPage}
                />
              )}
            </>
          )}
        </div>
      </div>
      {editingUser && (
        <EditUser
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
        />
      )}
      <AlertUser />
    </div>
  );
}
