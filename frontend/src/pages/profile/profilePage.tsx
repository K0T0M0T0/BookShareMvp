/* =========================
File: src/pages/profile/ProfilePage.tsx
========================= */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { updateProfile } from "../../store/Slices/usersSlice";

export default function ProfilePage() {
  const session = useSelector((s: RootState) => s.session);
  const users = useSelector((s: RootState) => s.users);
  const dispatch = useDispatch<AppDispatch>();
  const me = users.find((u) => u.id === session.userId);

  const [nick, setNick] = React.useState(me?.username || "");
  const [avatar, setAvatar] = React.useState(me?.avatar || "");

  if (!me) return <p>Please login to see your profile</p>;

  const save = () => {
    dispatch(updateProfile({ id: me.id, data: { username: nick, avatar } }));
    alert("Saved");
  };

  return (
    <section>
      <h2>Profile</h2>
      <div>
        <img
          src={avatar || "/default-avatar.png"}
          alt="avatar"
          style={{ width: 96, height: 96, borderRadius: 12 }}
        />
        <div>Nickname: {me.username}</div>
        <div>Email: {me.email}</div>
      </div>
      <div>
        <h4>Edit</h4>
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
        <button onClick={save}>Save</button>
      </div>

      <UserLists userId={me.id} />
    </section>
  );
}

function UserLists({ userId }: { userId: string }) {
  // saved lists/collections stored in localStorage per user
  const key = `lists_${userId}`;
  const [lists, setLists] = React.useState<{ name: string; ids: string[] }[]>(
    JSON.parse(localStorage.getItem(key) || "[]")
  );
  const [name, setName] = React.useState("");

  const add = () => {
    const next = [...lists, { name, ids: [] }];
    setLists(next);
    localStorage.setItem(key, JSON.stringify(next));
    setName("");
  };

  return (
    <div>
      <h3>Your Collections</h3>
      <ul>
        {lists.map((l, i) => (
          <li key={i}>
            {l.name} ({l.ids.length})
          </li>
        ))}
      </ul>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Collection name"
      />
      <button onClick={add}>Create collection</button>
    </div>
  );
}
