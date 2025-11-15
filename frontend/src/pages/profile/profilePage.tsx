import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { updateUserThunk } from "../../store/Slices/usersSlice";
import { logout } from "../../store/Slices/sessionSlice"; // ✅ import logout
import { Check, X, LogOut } from "lucide-react"; // ✅ icon for logout
import styles from "./ProfilePage.module.scss";
import CollectionsOverview from "../collections/components/CollectionsOverview";
import AddCollectionForm from "./components/AddCollectionForm";
import ProfileImage from "../../components/ProfileImage";

export default function ProfilePage() {
  const session = useSelector((s: RootState) => s.session);
  const users = useSelector((s: RootState) => s.users);
  const dispatch = useDispatch<AppDispatch>();
  const me = users.find((u) => u.id === session.userId);

  const [nick, setNick] = React.useState(me?.username || "");
  const [avatar, setAvatar] = React.useState(me?.avatar || "");
  const [editing, setEditing] = React.useState(false);

  if (!me) return <p>Please login to see your profile</p>;

  const save = async () => {
    try {
      await dispatch(
        updateUserThunk({ id: me.id, data: { username: nick, avatar } })
      ).unwrap();
      setEditing(false);
      alert("Saved");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const cancel = () => {
    setNick(me.username);
    setAvatar(me.avatar || "");
    setEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token"); // optional cleanup
    window.location.href = "/"; // redirect to homepage or login
  };

  return (
    <section className={styles.profilePage}>
      <h2>Profile</h2>

      <div className={styles.profileInfo}>
        <div className={styles.avatarWrapper}>
          <ProfileImage src={avatar} size={100} className={styles.avatar} />
        </div>

        <div className={styles.details}>
          {editing ? (
            <>
              <input
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                placeholder="Nickname"
              />
              <input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Avatar URL"
              />
              <div className={styles.editActions}>
                <button className={styles.save} onClick={save}>
                  <Check size={18} />
                </button>
                <button className={styles.cancel} onClick={cancel}>
                  <X size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.nickname}>{me.username}</div>
              <div className={styles.email}>{me.email}</div>
              <button
                className={styles.editToggleBtn}
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              {/* ✅ Logout button */}
              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.collections}>
        <CollectionsOverview userId={me.id} />
        <AddCollectionForm userId={me.id} />
      </div>
    </section>
  );
}
