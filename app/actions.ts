//server side validation of the form data
"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingschema } from "./utils/zodSchema";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import { emailClient } from "./utils/mailtrap";
import { formatCurrency } from "./utils/formatCurrency";

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

    const sender = {
        email: "hello@demomailtrap.co",
        name: "FlowPay"
    };

    emailClient.send({
        from: sender,
        to: [{email: 'bonolodinkoa@gmail.com'}], //use this -> if we have a confirmed domain submission.value.receipientEmail
        template_uuid: "1aeb4b05-be2a-4b15-8a0a-700e743127a2",
        template_variables: {
            clientName: submission.value.invoiceName,
            receipientName: submission.value.receipientName,
            senderName: submission.value.senderName,
            invoiceNumber: submission.value.invoiceNumber,
            invoiceDate: new Intl.DateTimeFormat('en-ZA', {
                dateStyle: 'medium',
            }).format(new Date(submission.value.issueDate)),
            dueDate: new Intl.DateTimeFormat('en-ZA', {
                dateStyle: 'medium',
            }).format(new Date(submission.value.dueDate)),
            totalAmount: formatCurrency(
                submission.value.totalAmount,
                submission.value.currency 
            ),
            status: submission.value.status,
            notes: submission.value.notes!,
            terms: submission.value.terms!,
            invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
        },
    });

    return redirect("/dashboard/invoices");
}

export async function editInvoice(previousState: any, formData: FormData){
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: invoiceSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const data = await prisma.invoice.update({
        where: {
            id: formData.get('id') as string,
            userId: session.user?.id,
        },
        data: {
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

    const sender = {
        email: "hello@demomailtrap.co",
        name: "FlowPay"
    };

    emailClient.send({
        from: sender,
        to: [{email: 'bonolodinkoa@gmail.com'}], //use this -> if we have a confirmed domain submission.value.receipientEmail
        template_uuid: "94946ff9-f52c-4f55-80bf-576812b9e29b",
        template_variables: {
            clientName: submission.value.invoiceName,
            receipientName: submission.value.receipientName,
            senderName: submission.value.senderName,
            invoiceNumber: submission.value.invoiceNumber,
            invoiceDate: new Intl.DateTimeFormat('en-ZA', {
                dateStyle: 'medium',
            }).format(new Date(submission.value.issueDate)),
            dueDate: new Intl.DateTimeFormat('en-ZA', {
                dateStyle: 'medium',
            }).format(new Date(submission.value.dueDate)),
            totalAmount: formatCurrency(
                submission.value.totalAmount,
                submission.value.currency 
            ),
            status: submission.value.status,
            notes: submission.value.notes!,
            terms: submission.value.terms!,
            invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
        },
    });

    return redirect('/dashboard/invoices');
}