import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/third-task/types/user.schema";

interface UsersPaginationProps {
  page: number;
  setPage: (page: number) => void;
  users: User[];
  perPage: number;
}

export default function UsersPagination({
  page,
  setPage,
  users,
  perPage,
}: UsersPaginationProps) {
  return (
    <div
      data-testid="users-pagination"
      className="flex items-center justify-between border-t border-slate-200 px-6 py-4"
    >
      <div className="text-sm text-slate-600">Page {page}</div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="hover:cursor-pointer"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={!users || users.length < perPage}
          className="hover:cursor-pointer"
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
