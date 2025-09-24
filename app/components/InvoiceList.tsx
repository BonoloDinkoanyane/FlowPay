import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoiceActions } from "./InvoiceActions";
import { prisma } from "../utils/db";
import { requireUser } from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";

async function getData(userId: string){
    const data = await prisma.invoice.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            receipientName: true,
            totalAmount: true,
            createdAt: true,
            status: true,
            invoiceNumber: true,
            currency: true,
            dueDate: true,
        }, 
        orderBy: {
            createdAt: 'desc'
        }
    });

    return data;
}

export async function InvoiceList() {
    const session = requireUser();
    const data = await getData((await session).user?.id as string);
    return (
        <>
        {data.length === 0 ? (
            <EmptyState 
                title='No invoices found'
                description= 'Create an invoice to get started'
                buttonText="Create Invoice"
                href="/dashboard/invoices/create"
            />
        ): (
            <Table>
                {/* Table header is the wrapper for the <TableHead>  */}
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((invoice) => (
                        <TableRow key={invoice.id}>
                        <TableCell>#{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.receipientName}</TableCell>
                        <TableCell>{formatCurrency(
                            invoice.totalAmount, 
                            invoice.currency
                            )}
                        </TableCell>
                        <TableCell>
                        <Badge
                            className={
                                invoice.status === "PAID"
                                ? "bg-green-600 text-white"
                                : invoice.status === "OVERDUE" ||
                                    (invoice.dueDate && new Date(invoice.dueDate) < new Date())
                                ? "bg-red-600 text-white"
                                : invoice.status === "PENDING"
                                ? "bg-yellow-400 text-black"
                                : ""
                            }
                            variant="default"
                            >
                                {invoice.status}
                                {invoice.status !== "PAID" &&
                                    invoice.dueDate &&
                                    new Date(invoice.dueDate) < new Date() &&
                                    " - Overdue"}
                            </Badge>
                        </TableCell>
                        <TableCell>{new Intl.DateTimeFormat('en-ZA', {
                            dateStyle: "medium",
                            }).format(invoice.createdAt)
                            }
                        </TableCell>
                        <TableCell className="text-right">
                            <InvoiceActions 
                            status={invoice.status}
                            id={invoice.id}
                            />
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        )}
            
        </>
    );
}