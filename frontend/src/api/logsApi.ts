const API_URL = "http://localhost:5000/api/logs";

export async function fetchLogs(token: string) {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch logs");
  return await res.json();
}

export async function saveLog(log: any, token: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(log),
  });

  if (!res.ok) throw new Error("Failed to save log");
  return await res.json();
}
