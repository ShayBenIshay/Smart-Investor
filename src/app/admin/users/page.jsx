import Users from "@/components/entities/users/Users";
import { getUsers } from "@/lib/data";

const UsersPage = async () => {
  const users = await getUsers();

  return <Users users={users} />;
};

export default UsersPage;
