//server side validation of the form data
"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingschema } from "./utils/zodSchema";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";

export async function onboardUser(prevState: any, formData: FormData) {
    const session = await requireUser();
    
    const submission = parseWithZod(formData, {
        schema: onboardingschema, 
    });

    if (submission.status !== "success"){
        return submission.reply();
    }

    const data = await prisma.user.update({
        where: {
            id: session.user?.id,
        }, 
        data: {
            firstName: submission.value.firstName,
            lastName: submission.value.lastName,
            businessName: submission.value.businessName,
            addressLine1: submission.value.addressLine1,
            addressLine2: submission.value.addressLine2,
            city: submission.value.city,
            province: submission.value.province,
            postalCode: submission.value.postalCode,
            //onboardingComplete: true,
        }
    });

    //redirect to dashboard after successful onboarding
    return redirect("/dashboard");
}

export async function createInvoice(previousState: any, formData: FormData) {
    //only authenticated users are allowed to create an invoice
    const session = await requireUser();

    // Make sure we have a user; asserting that the user exists before using session.user.id.
    if (!session.user || !session.user.id) {
        throw new Error("User not found or not authenticated");
    }

    const submission = parseWithZod(formData, {
        schema: invoiceSchema, 
    });

    if (submission.status !== "success"){
        return submission.reply();
    }

    const data = await prisma.invoice.create({
        data: {
            //maps the userid
            userId: session.user.id,

            invoiceName: submission.value.invoiceName,
            invoiceNumber: submission.value.invoiceNumber,
            currency: submission.value.currency,
            status: submission.value.status,
            issueDate: submission.value.issueDate,
            dueDate: submission.value.dueDate,
            totalAmount: submission.value.totalAmount,
            notes: submission.value.notes,
            terms: submission.value.terms,
            itemQuantity: submission.value.itemQuantity,
            itemPrice: submission.value.itemPrice,
            item: submission.value.item,
            senderName: submission.value.senderName,
            senderEmail: submission.value.senderEmail,
            senderAddress: submission.value.senderAddress,
            receipientName: submission.value.receipientName,
            receipientEmail: submission.value.receipientEmail,
            receipientAddress: submission.value.receipientAddress,
        }
    });

    return redirect("/dashboard/invoices");
}