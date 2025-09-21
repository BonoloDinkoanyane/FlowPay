import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

//post request route handler 
export async function POST(request: Request, {
    params,
}: {
    params: Promise<{invoiceId: string}> //in th params we fetch the invoice id
}){

    try {
        const session = await requireUser();

        const {invoiceId} = await params; //awaits the invoiceid params

        //fetches the userid of the logged in user, and the invoice id 
        const invoiceData = await prisma.invoice.findUnique({
            where: {
                id: invoiceId,
                userId: session.user?.id,
            },

        });

        if (!invoiceData){
            return NextResponse.json({error: "Invoice not found"}, {status: 404});
        }

        const sender = {
            email: "hello@demomailtrap.co",
            name: "FlowPay"
        };
        
        emailClient.send({
            from: sender,
            to: [{email: 'bonolodinkoa@gmail.com'}], //use this -> if we have a confirmed domain submission.value.receipientEmail
            template_uuid: "b1568b77-68e1-4e43-9bba-aea8c3eba0eb",
            template_variables: {
            "company_info_name": invoiceData.senderName,
            "invoiceName": "Test_Invoicename",
            "company_info_address": "Test_Company_info_address",
            "company_info_city": "Test_Company_info_city",
            "company_info_zip_code": "Test_Company_info_zip_code",
            "company_info_country": "Test_Company_info_country"
            }
        });

        return NextResponse.json({success: true});
    } catch {
        return NextResponse.json({error: 'Failed to send email reminder.'}, {status: 500})
    }
}