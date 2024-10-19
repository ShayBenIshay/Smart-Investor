"use server";

import Wallet from "../../components/wallet/Wallet";
import { User } from "@/lib/models";
import { auth } from "@/auth";
import { connectToDb } from "@/lib/utils";

const UserPage = async () => {
  const session = await auth();
  const id = session?.user?.id;
  try {
    connectToDb();
    const user = await User.findOne({ _id: id });
    return <Wallet liquid={user.wallet} />;
  } catch (error) {
    console.error(error);
  }

  return <p>Error fetching user data</p>;
};

export default UserPage;
