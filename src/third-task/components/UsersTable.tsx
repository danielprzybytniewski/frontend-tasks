import { Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/third-task/types/user.schema";

interface UsersTableProps {
  users?: User[];
  setEditingUser: (user: User) => void;
}

export default function UsersTable({ users, setEditingUser }: UsersTableProps) {
  return (
    <Table data-testid="users-table">
      <TableHeader className="pointer-events-none bg-gray-400">
        <TableRow>
          <TableHead className="text-gray-50">ID</TableHead>
          <TableHead className="text-gray-50">Name</TableHead>
          <TableHead className="text-gray-50">Email</TableHead>
          <TableHead className="text-gray-50">Gender</TableHead>
          <TableHead className="text-gray-50">Status</TableHead>
          <TableHead className="text-right text-gray-50">Edit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="py-8 text-center text-slate-500">
              User not found
            </TableCell>
          </TableRow>
        ) : (
          users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-mono text-sm text-slate-500">
                {user.id}
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-slate-600">{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.gender === "male" ? "default" : "secondary"}
                >
                  {user.gender === "male" ? "Male" : "Female"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "active" ? "default" : "secondary"}
                >
                  {user.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  data-testid="edit-user-button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingUser(user)}
                  className="transition-colors duration-200 hover:cursor-pointer hover:bg-gray-200"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
