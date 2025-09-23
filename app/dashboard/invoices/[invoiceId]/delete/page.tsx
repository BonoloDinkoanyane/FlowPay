import { deleteInvoice } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Authorise(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
    select: {
      id: true,
      invoiceNumber: true,
      invoiceName: true,
      totalAmount: true,
      issueDate: true,
      dueDate: true,
      status: true,
    },
  });

  if (!data) {
    return redirect("/dashboard/invoices");
  }

  return data;
}

type Params = {
  invoiceId: string;
};

export default async function DeleteInvoice({ params }: { params: Params }) {
  const session = await requireUser();
  const { invoiceId } = params;
  const invoice = await Authorise(invoiceId, session.user?.id as string);

  return (
    <div className="flex flex-1 h-screen justify-center items-center p-6 bg-gray-50">
      <Card className="max-w-[650px] w-full shadow-xl border">
        <CardHeader className="text-center space-y-3">
          <TriangleAlert className="text-red-500 w-16 h-16 mx-auto" />
          <CardTitle className="text-2xl font-bold text-red-600">
            Delete Invoice
          </CardTitle>
          <CardDescription className="text-base">
            Are you sure you want to delete this invoice? <br />
            <span className="font-semibold text-gray-700">
              This action cannot be undone.
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-md border p-6 bg-white shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-800 text-lg">
              Invoice Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Invoice #</p>
                <p className="font-medium">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Invoice Name</p>
                <p className="font-medium">{invoice.invoiceName}</p>
              </div>
              <div>
                <p className="text-gray-500">Amount</p>
                <p className="font-medium text-green-600">
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                  }).format(invoice.totalAmount ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <Badge
                    variant={
                        invoice.status === "PAID"
                        ? "default"
                        : invoice.status === "OVERDUE" ||
                            (invoice.dueDate && new Date(invoice.dueDate) < new Date())
                        ? "destructive"
                        : "secondary"
                    }
                 >
                    {invoice.status}
                    {invoice.status !== "PAID" &&
                        invoice.dueDate &&
                        new Date(invoice.dueDate) < new Date() &&
                        " - Overdue"}
                </Badge>
              </div>
              <div>
                <p className="text-gray-500">Issue Date</p>
                <p className="font-medium">
                  {invoice.issueDate?.toLocaleDateString("en-ZA")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Due Date</p>
                <p className="font-medium text-red-500">
                  {invoice.dueDate?.toLocaleDateString("en-ZA")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Link
            href={"/dashboard/invoices"}
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteInvoice(invoiceId);
            }}
          >
            <SubmitButton 
             variant="destructive"
             text="Delete Invoice"
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}