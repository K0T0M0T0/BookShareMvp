import React from "react";

export default function AddCollectionForm({ userId }: { userId: string }) {
  const [name, setName] = React.useState("");
  const key = `lists_${userId}`;

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const existing: { name: string; ids: string[] }[] = JSON.parse(
      localStorage.getItem(key) || "[]"
    );
    if (existing.some((e) => e.name.toLowerCase() === trimmed.toLowerCase())) {
      alert("Collection with this name already exists");
      return;
    }
    const next = [...existing, { name: trimmed, ids: [] }];
    localStorage.setItem(key, JSON.stringify(next));
    setName("");
    // notify listeners to refresh
    window.dispatchEvent(new CustomEvent("collections:changed", { detail: { userId } }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add();
  };

  return (
    <form className="addCollection" onSubmit={onSubmit}>
      <div className="addCollectionRow">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New collection name"
          aria-label="Collection name"
        />
        <button type="submit" disabled={!name.trim()}>Create</button>
      </div>
      <p className="hint">Tip: Use short, descriptive names like "Mystery TBR"</p>
    </form>
  );
}


