export const changeWallet = async (amount, operation) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/wallet`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, operation }),
    });
    if (!res.ok) {
      throw new Error("Failed to update wallet");
    }

    const data = await res.json();
    return data.wallet;
  } catch (error) {
    console.error(error);
    throw new Error("Transaction failed");
  }
};