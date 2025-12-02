import React from "react";
import { createCollectionThunk } from "../../../store/Slices/collectionsSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

export default function AddCollectionForm({ userId }: { userId: string }) {
  const [name, setName] = React.useState("");
  const dispatch = useAppDispatch();

  const collections = useAppSelector((s) =>
    s.collections.filter((c) => c.userId === userId)
  );

  const add = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    // Prevent duplicate names
    if (
      collections.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      alert("Collection with this name already exists");
      return;
    }

    try {
      await dispatch(createCollectionThunk({ userId, name: trimmed })).unwrap();

      setName("");
    } catch (err) {
      alert("Failed to create collection");
    }
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
        <button type="submit" disabled={!name.trim()}>
          Create
        </button>
      </div>
      <p className="hint">
        Tip: Use short, descriptive names like "Mystery TBR"
      </p>
    </form>
  );
}
