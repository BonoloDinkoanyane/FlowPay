import { InvoiceList } from "@/app/components/InvoiceList";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function InvoicesPage() {    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-bold text-2xl">Invoices</CardTitle>
                        <CardDescription>Manage your invoices</CardDescription>
                    </div>
                    <Link 
                     href="/dashboard/invoices/create" 
                     className={buttonVariants()}>
                    <PlusIcon /> Create Invoice
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <InvoiceList />
            </CardContent>
        </Card>
    );
}