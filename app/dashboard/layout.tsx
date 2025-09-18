import Link from "next/link";
import { auth, signOut } from "../utils/auth";
import { requireUser } from "../utils/hooks";
import Flowpay from "@/public/Flowpay.png";
import Image from "next/image";
import DashboardLinks from "../components/dashboardLinks";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { prisma } from "../utils/db";
import { redirect } from "next/navigation";

async function getUser(userId: string) {
    const data = await prisma.user.findUnique ({
        where: {
            id: userId,
        },
        //selects these following properites from the db
        select: {
            firstName: true,
            lastName: true,
            email: true,
            addressLine1: true,
            city: true,
            province: true,
            postalCode: true,
            country: true,
            businessName: true,
        }
    });
    //checks if the properties are filled out; if not, redirects to onboarding page so they can be filled in
    if (!data?.addressLine1 || !data.firstName || !data.lastName || !data.city || 
        !data.postalCode || !data.country || !data.businessName) {
        redirect('/onboarding');
    }
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    
    const session = await requireUser();
    const data = await getUser(session.user?.id as string);
    
    return(
        <>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] 
                lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex flex-col max-h-screen h-full gap-2">
                        <div className="h-14 flex items-center border-b px-4 lg:h-[60px]
                            lg:px-6">
                            <Link href="/" className="flex items-center gap-2">
                            <Image src={Flowpay} alt="Logo" className="size-7" />
                            <p className="font-bold text-2xl">
                                Flow<span className="text-blue-600">Pay</span>
                            </p>
                            </Link>
                        </div>
                        <div className="flex-1">
                            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <DashboardLinks />
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                       <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="md:hidden" size="icon">
                                    <Menu className="size-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <nav className="grid gap-2 mt-10">
                                    <DashboardLinks />
                                </nav>
                            </SheetContent>
                       </Sheet>
                       <div className="flex items-center ml-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                      className="rounded-full"
                                      variant="outline"
                                      size="icon"
                                    >
                                        <User2/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/invoices">
                                            Invoices
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <form
                                          className="w-full"
                                          action={async () => {
                                            "use server"; //inline server action; async function that runs on the server side
                                            await signOut();
                                          }}
                                        >
                                            <button className="w-full text-left">
                                                Logout
                                            </button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                       </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}