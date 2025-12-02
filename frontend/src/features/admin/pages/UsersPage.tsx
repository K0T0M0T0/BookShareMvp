/* =========================
File: src/features/admin/pages/Users/UsersPage.tsx
========================= */
import { toggleBanThunk, setAdminThunk } from "../../../store/Slices/usersSlice";
import styles from "../../../styles/components/admin/UsersPage.module.scss";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((s) => s.users);

  // Separate users by type
  const admins = users.filter((u) => u.isAdmin);
  const banned = users.filter((u) => u.banned);
  const regular = users.filter((u) => !u.isAdmin && !u.banned);

  const handleBanToggle = (id: string) => {
    dispatch(toggleBanThunk({ id }));
  };

  const handleAdminToggle = (id: string, value: boolean) => {
    dispatch(setAdminThunk({ id, value }));
  };

  const renderUserTable = (title: string, list: typeof users) => (
    <div className={styles.group}>
      <h3>{title}</h3>
      {list.length === 0 ? (
        <p className={styles.empty}>No users in this group</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? "Admin" : "User"}</td>
                <td>{u.banned ? "Banned" : "Active"}</td>
                <td>
                  {/* Ban/unban */}
                  <button
                    onClick={() => handleBanToggle(u.id)}
                    className={u.banned ? styles.unbanBtn : styles.banBtn}
                  >
                    {u.banned ? "Unban" : "Ban"}
                  </button>

                  {/* Promote/demote admin */}
                  {!u.banned && (
                    <button
                      onClick={() => handleAdminToggle(u.id, !u.isAdmin)}
                      className={
                        u.isAdmin ? styles.demoteBtn : styles.promoteBtn
                      }
                    >
                      {u.isAdmin ? "Revoke Admin" : "Make Admin"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <h2>User Management</h2>
      {renderUserTable("Admins", admins)}
      {renderUserTable("Regular Users", regular)}
      {renderUserTable("Banned Users", banned)}
    </div>
  );
}
