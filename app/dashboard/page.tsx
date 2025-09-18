import { redirect } from "next/navigation";
import { auth, signOut } from "../utils/auth";
import { requireUser } from "../utils/hooks";

export default async function DashboardPage() {
    const session = await requireUser();

    return(
        <>
             <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
        </>
    )
}