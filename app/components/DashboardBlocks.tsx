import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { prisma } from "../utils/db";
import { requireUser } from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";

async function getData(userId: string){
    const [data, openinvoices, paidInvoices] = await Promise.all([
        prisma.invoice.findMany({
            where: {
                userId: userId,
            },
            select: {
                totalAmount: true,
                currency: true,
                createdAt: true,
            }
        }), 
        prisma.invoice.findMany({
            where: {
                userId: userId,
                status: 'PENDING',
            },
            select: {
                id: true,
            }
        }),
        prisma.invoice.findMany({
            where: {
                userId: userId,
                status: 'PAID',
            },
            select: {
                id: true,
            }
        })
    ]);

    return {
        data, 
        openinvoices, 
        paidInvoices
    }
}

export default async function DashboardBlocks(){

    const session = await requireUser();
    const {data, openinvoices, paidInvoices} = await getData(session.user?.id as string);
    return(
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Revenue 
                    </CardTitle>
                    <DollarSign className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">
                        {formatCurrency(
                            data
                                .filter(invoice => {
                                const thirtyDaysAgo = new Date();
                                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                return new Date(invoice.createdAt) >= thirtyDaysAgo;
                                })
                                .reduce((acc, invoice) => acc + invoice.totalAmount, 0),
                            "ZAR"
                        )}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        The total value of issued invoices in the last 30 days
                    </p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Invoices Issued
                    </CardTitle>
                    <Users className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">
                        +{data.length}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        based on the last 30 days
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Paid Invoices
                    </CardTitle>
                    <CreditCard className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">
                        +{paidInvoices.length}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        The total value of paid invoices
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Pending Invoices
                    </CardTitle>
                    <Activity className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-bold">
                        +{openinvoices.length}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Total unpaid invoices
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}