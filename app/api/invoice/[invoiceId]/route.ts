import { prisma } from "@/app/utils/db";
import { error } from "console";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import { formatCurrency } from "@/app/utils/formatCurrency";


export async function GET(
    request: Request,
    {
        params,
    }: {
        params: Promise<{invoiceId: string}>
    }) {

    const {invoiceId} = await params;

    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
        },
        select: {
            invoiceName: true,
            invoiceNumber: true,
            currency: true,
            senderName: true,
            senderEmail: true,
            senderAddress: true,
            receipientName: true,
            receipientEmail: true,
            receipientAddress: true,
            issueDate: true,
            dueDate: true,
            item: true,
            itemQuantity: true,
            itemPrice: true,
            totalAmount: true,
            notes: true,
            terms: true,
        }
    });

    if(!data){
        return NextResponse.json({error: 'Invoice not found'}, {status: 404});
    }

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: 'mm',
        format: 'a4',
    });

    //setting the font
    pdf.setFont('helvetica');

    //setting the header
    pdf.setFontSize(24);
    pdf.text(data.invoiceName, 20, 20);

    //from section
    pdf.setFontSize(12);
    pdf.text("From", 20, 40);
    pdf.setFontSize(10);
    pdf.text([data.senderName, data.senderEmail, data.senderAddress], 20, 45)

    //client section
    pdf.setFontSize(12);
    pdf.text("Bill to:", 20, 70);
    pdf.setFontSize(10);
    pdf.text([data.receipientName, data.receipientEmail, data.receipientAddress], 20, 75)

    //invoice details
    pdf.setFontSize(10);
    pdf.text(`Invoice Number: #${data.invoiceNumber}`, 128, 40);
    pdf.text(`
        Date: ${new Intl.DateTimeFormat("en-ZA", {
            dateStyle: 'long',
        }).format(data.issueDate)}`, 
        120, 
        45,
    );
    pdf.text(`
        Due date: ${new Intl.DateTimeFormat('en-ZA',{
            dateStyle:'long',
        }).format(data.dueDate)}`,
        120,
        50
    );

    //item table header
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Item', 20, 100);
    pdf.text('Quantity', 100, 100);
    pdf.text('Each', 130, 100);
    pdf.text('Amount', 160, 100);

    pdf.line(20, 102, 190, 102);

    //item details
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.item, 20, 110);
    pdf.text(data.itemQuantity.toString(), 100, 110);
    pdf.text(
        formatCurrency(
            data.itemPrice,
            data.currency
        ),
        130,
        110,
    );
    pdf.text(
        formatCurrency(
            data.totalAmount,
            data.currency
        ),
        160,
        110,
    );

    //totals section
    pdf.line(20, 115, 190, 115);
    pdf.setFont('helvetica');
    pdf.text(`Total (${data.currency})`, 130, 130);
    pdf.text(
        formatCurrency(
            data.totalAmount,
            data.currency,
        ),
        160,
        130,
    );

    //additional notes and terms section
    if (data.notes){
        pdf.setFont('helvetica');
        pdf.setFontSize(10);
        pdf.text("Notes", 20, 150);
        pdf.text(data.notes, 20, 155);
    };

    if (data.terms){
        pdf.setFont('helvetica');
        pdf.setFontSize(10);
        pdf.text("Notes", 20, 170);
        pdf.text(data.terms, 20, 175);
    };





    //generating pdf as buffer 
    //it convers the the jspdf into an array buffer; a low-level representation of binary data
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

    //return pdf as download
    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-type": "application/pdf",  //means we want to generate/return a pdf file
            "Content-disposition": "inline", //inline; shows it in the brower(opens a new tab), does not neccesarily download it

        }
    })
} 