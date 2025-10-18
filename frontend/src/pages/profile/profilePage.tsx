/* =========================
File: src/pages/profile/ProfilePage.tsx
========================= */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { updateProfile } from "../../store/Slices/usersSlice";
import { Check, X } from "lucide-react";
import styles from "./ProfilePage.module.scss";
import CollectionsOverview from "../collections/components/CollectionsOverview";
import AddCollectionForm from "./components/AddCollectionForm";

export default function ProfilePage() {
  const session = useSelector((s: RootState) => s.session);
  const users = useSelector((s: RootState) => s.users);
  const dispatch = useDispatch<AppDispatch>();
  const me = users.find((u) => u.id === session.userId);

  const [nick, setNick] = React.useState(me?.username || "");
  const [avatar, setAvatar] = React.useState(me?.avatar || "");
  const [editing, setEditing] = React.useState(false);

  if (!me) return <p>Please login to see your profile</p>;

  const save = () => {
    dispatch(updateProfile({ id: me.id, data: { username: nick, avatar } }));
    setEditing(false);
    alert("Saved");
  };

  const cancel = () => {
    setNick(me.username);
    setAvatar(me.avatar || "");
    setEditing(false);
  };

  return (
    <section className={styles.profilePage}>
      <h2>Profile</h2>

      <div className={styles.profileInfo}>
        {/* --- Avatar --- */}
        <div className={styles.avatarWrapper}>
          <img src={avatar || "/default-avatar.png"} alt="avatar" />
        </div>

        {/* --- Details --- */}
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
