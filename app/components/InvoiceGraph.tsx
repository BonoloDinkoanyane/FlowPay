import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Graph } from "./Graph";
import { prisma } from "../utils/db";
import { requireUser } from "../utils/hooks";
import { object } from "zod";

async function getInvoices(userId: string) {
    const rawData = await prisma.invoice.findMany({
        where: {
            status: 'PAID',
            userId: userId,
            createdAt: {
                lte: new Date(), //less than
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), //greater than 30 days 24hrs, 60mins, 60secs, 1000ms; exactly 30days ago
            }
        },
        select: {
            createdAt: true,
            totalAmount: true,
        },
        orderBy: {
            createdAt: 'asc',
        }
    });

    //group and aggregate data by date
    const aggregatedData = rawData.reduce(
    (acc: { [key: string]: number }, curr) => {
        // Format invoice creation date as "Sep 1" (month + day only)
        const dateKey = curr.createdAt.toLocaleDateString("en-ZA", {
        month: "short",
        day: "numeric",
        });

        // Add the invoice amount to that date's total
        // If the date doesn't exist yet, initialize with 0 first
        acc[dateKey] = (acc[dateKey] || 0) + curr.totalAmount;

            // return updated accumulator for next iteration
            return acc;
        },{} // start with empty object {}
    );

    //convert to array and format the object
    // turn { "Sep 1": 500 } into [["Sep 1", 500]]
    const transformedData = Object.entries(aggregatedData).map(([date, amount]) => ({
        date, // keep the formatted date string (e.g., "Sep 1")
        amount: Number(amount), // total amount for that date

        // Create a real Date object so we can sort chronologically
        // Assumes current year since we only have "month + day"
        originaldate: new Date(date + ', ' + new Date().getFullYear()),
        })

         // Sort invoices by their actual chronological date
    ).sort((a, b) => a.originaldate.getTime() - b.originaldate.getTime())

    // Remove originaldate (we only needed it for sorting)
    .map(({date, amount}) => ({
        date,
        amount,
    }));

    // Return the final array in format [{ date: "Sep 1", amount: 500 }, ...]
    return transformedData;
}

export async function InvoiceGraph(){

    const session = requireUser();

    const data = await getInvoices((await session).user?.id as string);

    return(
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Paid Invoices</CardTitle>
                <CardDescription>
                    Invoices that have been paid in the last 30 days.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Graph 
                 data={data}
                />
            </CardContent>
        </Card>
    )
}