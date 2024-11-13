import { auth } from "@/auth";
import { User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";

export async function POST(req) {
  const session = await auth();

  await connectToDb();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { amount, operation } = await req.json();

  if (!amount || !operation) {
    return new Response("Invalid data", { status: 400 });
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    if (operation === "deposit") {
      user.wallet += parseFloat(amount);
    } else if (operation === "withdraw") {
      if (user.wallet < amount) {
        return new Response("Insufficient funds", { status: 400 });
      }
      user.wallet -= parseFloat(amount);
    }

    await user.save();

    return new Response(
      JSON.stringify({ message: "Wallet updated", wallet: user.wallet }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating wallet:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
