/* =========================
File: src/pages/profile/ProfilePage.tsx
========================= */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { updateProfile } from "../../store/Slices/usersSlice";
import { Check, X } from "lucide-react";
import styles from "./ProfilePage.module.scss";

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

      <UserLists userId={me.id} username={me.username} />
    </section>
  );
}

/* =========================
User Collections (Cards)
========================= */

function UserLists({ userId, username }: { userId: string; username: string }) {
  const key = `lists_${userId}`;
  const [lists, setLists] = React.useState<{ name: string; ids: string[] }[]>(
    JSON.parse(localStorage.getItem(key) || "[]")
  );
  const [name, setName] = React.useState("");

  const add = () => {
    if (!name.trim()) return;
    const next = [...lists, { name, ids: [] }];
    setLists(next);
    localStorage.setItem(key, JSON.stringify(next));
    setName("");
  };

  // random placeholder book covers (for demo)
  const covers = [
    "https://picsum.photos/200/300?1",
    "https://picsum.photos/200/300?2",
    "https://picsum.photos/200/300?3",
    "https://picsum.photos/200/300?4",
  ];

  return (
    <div className={styles.collections}>
      <h3>Your Collections</h3>

      <div className={styles.collectionGrid}>
        {lists.map((l, i) => (
          <div key={i} className={styles.collectionCard}>
            <img src={covers[i % covers.length]} alt={l.name} />
            <div className={styles.cardContent}>
              <h4>{l.name}</h4>
              <p>by {username}</p>
              <p>{l.ids.length} books</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.addCollection}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Collection name"
        />
        <button onClick={add}>Create</button>
      </div>
    </div>
  );
}
