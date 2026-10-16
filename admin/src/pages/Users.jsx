import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();

    const timer = setInterval(fetchUsers, 15000);
    return () => clearInterval(timer);
  }, []);

  async function fetchUsers() {
    const { data, error } = await api
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setUsers(data);
    }
  }

  return (
    <div>
      <h1>Users Page</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
