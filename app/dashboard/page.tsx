import { redirect } from "next/navigation";
import { auth, signOut } from "../utils/auth";
import { requireUser } from "../utils/hooks";
import DashboardBlocks from "../components/DashboardBlocks";
import { InvoiceGraph } from "../components/InvoiceGraph";
import { RecentInvoices } from "../components/RecentInvoices";
import { prisma } from "../utils/db";
import { EmptyState } from "../components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

async function getData(userId: string){
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    }, 
    select: {
      id: true,
    }
  });

  return data;
}

export default async function DashboardPage() {
    const session = await requireUser();
    const data = await getData(session.user?.id as string);
    return(
        <>
        {data.length <1 ? (
          <EmptyState 
           title='Create an invoice to get started'
           description= 'Please create an invoice to view your dashboard analytics'
           buttonText="Create Invoice"
           href="/dashboard/invoices/create"
          />
        ): (
          
          <>
          <Suspense fallback={<Skeleton className="w-full h-full flex-1" />}>
            <DashboardBlocks />
          </Suspense>

          <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
            <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
              <InvoiceGraph />
            </Suspense>

            <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
              <RecentInvoices />
            </Suspense>
          </div>
        </>
        )}
        
        </>
    )
}