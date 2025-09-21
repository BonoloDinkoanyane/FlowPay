//the hooks all rely on js bundles so they need to be explicitly marked
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar1Icon } from "lucide-react";
import { SubmitButton } from "./SubmitButtons";
import { formatCurrency } from "../utils/formatCurrency";
import { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "../utils/zodSchema";
import currencies from "@/data/currencies.json";
import { Prisma } from "@/lib/generated/prisma";
import { createInvoice, editInvoice } from "../actions";

interface IAppProps{

    data: Prisma.InvoiceGetPayload<{}>
}

export function Editinvoice({data}: IAppProps){

    //form stste hooks
    const [lastResult, action] = useActionState(editInvoice, undefined);
    const [form, fields] = useForm({
        //lastResult syncs the form with the server action
        lastResult, 
            
        onValidate({formData}) {
            return parseWithZod(formData, {
                schema: invoiceSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        });

        // Separate state for invoice and due date
        const [invoiceDate, setInvoiceDate]= useState(data.issueDate);
        const [dueDate, setDueDate]= useState(data.dueDate);
        const [invoicePopoverOpen, setInvoicePopoverOpen] = useState(false);
        const [duePopoverOpen, setDuePopoverOpen] = useState(false);
    
        //the updated values are now stored in the state 
        //and can be used to calculate the total
        const [price, setPrice] = useState(data.itemPrice.toString());
        const [quantity, setQuantity] = useState(data.itemQuantity.toString());
        const [currency, setCurrency] = useState(data.currency);
    
        const calculateTotal = (Number(quantity) || 0) * (Number(price) || 0);

        return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <form id={form.id} 
                 action={action} 
                 noValidate 
                 onSubmit={form.onSubmit}
                >
                    {/* a hidden input field that validates the date input
                        it validates it by converting it to a string meaning no issues when we store it in the db 
                        and in the server action
                        The error message is rendered in the calendar div
                    */}
                    <Input 
                     type="hidden"
                     name = {fields.issueDate.name}
                     value= {invoiceDate.toISOString()}
                    />

                    <Input 
                     type="hidden"
                     name = {fields.dueDate.name}
                     value= {dueDate.toISOString()}
                    />

                    <Input 
                     type="hidden"
                     name={fields.totalAmount.name}
                     value={calculateTotal}
                     />

                    {/*making the id avavilable to the form data */}
                    <Input 
                     name = 'id'
                     value= {data.id}
                     type = 'hidden'
                    />
                    <div className="flex flex-col gap-1 w-fit mb-6">
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary">draft</Badge>
                            <Input 
                             placeholder="Invoice Name" 
                             name= {fields.invoiceName.name} 
                             key= {fields.invoiceName.key} 
                             defaultValue={data.invoiceName}
                             />
                        </div>
                        <p className="text-sm text-red-600">{fields.invoiceName.errors}</p>
                    </div>
                    {/* layout wrapper div */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <Label>Invoice No.</Label>
                            <div className="flex">
                                <span className=" flex items-center px-3 border border-r-0 rounded-l-md">#</span>
                                <Input 
                                 name={fields.invoiceNumber.name}
                                 key={fields.invoiceNumber.key}
                                 defaultValue={data.invoiceNumber}
                                 className="rounded-l-none" 
                                 placeholder="001" 
                                 />
                            </div>
                            <p className="text-sm text-red-600">{fields.invoiceNumber.errors}</p>
                        </div>

                        <div>
                            <Label>Currency</Label>
                            <Select 
                             name= {fields.currency.name}
                             key= {fields.currency.key}
                             onValueChange={(value) => setCurrency(value)}
                             defaultValue={data.currency}
                             >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(currencies).map(([code, data]) => (
                                        <SelectItem key={code} value={code}>
                                            {data.name} ({code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-red-600">{fields.currency.errors}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label>From</Label>
                            <div className="space-y-2">
                                <Input 
                                 name={fields.senderName.name}
                                 key={fields.senderName.key}
                                 defaultValue={data.senderName?.trim()}
                                 placeholder="Your Name, or Company Name" 
                                 />
                                 <p className="text-sm text-red-600">{fields.senderName.errors}</p>
                                <Input 
                                 name= {fields.senderEmail.name}
                                 key= {fields.senderEmail.key}
                                 defaultValue={data.senderEmail}
                                 placeholder="Your Email" 
                                 />
                                 <p className="text-sm text-red-600">{fields.senderEmail.errors}</p>
                                <Input 
                                 name= {fields.senderAddress.name}
                                 key= {fields.senderAddress.key}
                                 defaultValue={data.senderAddress}
                                 placeholder="Your Address" 
                                 />
                                 <p className="text-sm text-red-600">{fields.senderAddress.errors}</p>
                            </div>
                        </div>

                        <div>
                            <Label>Receipient</Label>
                            <div className="space-y-2">
                                <Input 
                                 name= {fields.receipientName.name}
                                 key= {fields.receipientName.key}
                                 defaultValue={data.receipientName}
                                 placeholder="Receipient Name, or Company Name" 
                                 />
                                 <p className="text-sm text-red-600">{fields.receipientName.errors}</p>
                                <Input 
                                 name= {fields.receipientEmail.name}
                                 key= {fields.receipientEmail.key}
                                 defaultValue={data.receipientEmail}
                                 placeholder="Client Email" 
                                 />
                                 <p className="text-sm text-red-600">{fields.receipientEmail.errors}</p>
                                <Input 
                                 name= {fields.receipientAddress.name}
                                 key= {fields.receipientAddress.key}
                                 defaultValue={data.receipientAddress}
                                 placeholder="Client Address" 
                                 />
                                 <p className="text-sm text-red-600">{fields.receipientAddress.errors}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <div>
                            <Label>Invoice Date</Label>
                            </div>
                            <Popover open={invoicePopoverOpen} onOpenChange={setInvoicePopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[280px] text-left justify-start">
                                        <Calendar1Icon /> 
                                        {invoiceDate ? (
                                            new Intl.DateTimeFormat("en-ZA", {
                                                dateStyle: "long", 
                                            }).format(invoiceDate)
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar 
                                    mode="single" 
                                    selected={invoiceDate}
                                    onSelect={(date) => { 
                                        setInvoiceDate(date || new Date());
                                        setInvoicePopoverOpen(false);
                                    }}
                                    disabled={{before: new Date()}}
                                    />
                                </PopoverContent>
                            </Popover>
                            <p className="text-sm text-red-600">{fields.issueDate.errors}</p>
                        </div>

                            <div>
                                <div>
                                    <Label>Due Date</Label>
                                </div>
                                <Popover open={duePopoverOpen} onOpenChange={setDuePopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[280px] text-left justify-start">
                                        <Calendar1Icon /> 
                                        {dueDate ? (
                                            new Intl.DateTimeFormat("en-ZA", {
                                                dateStyle: "long", 
                                            }).format(dueDate)
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar 
                                    mode="single" 
                                    selected={dueDate}
                                    onSelect={(date) => {
                                        setDueDate(date || new Date());
                                        setDuePopoverOpen(false); // auto-close after selection
                                    }}
                                    disabled={{
                                        before: invoiceDate || new Date(), // due date can't be before invoice date
                                    }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <p className="text-sm text-red-600">{fields.dueDate.errors}</p>
                            </div>
                    </div>

                    <div>
                        <div className="grid md:grid-cols-12 gap-4 mb-2 font-medium">
                            <p className="col-span-6">Item</p>
                            <p className="col-span-2">Quantity</p>
                            <p className="col-span-2">Unit Price</p>
                            <p className="col-span-2">Total</p>
                        </div>

                        <div className="grid md:grid-cols-12 gap-4 mb-6">
                            <div className="col-span-6">
                                <Textarea 
                                 name = {fields.item.name}
                                 key= {fields.item.key}
                                 defaultValue={data.item}
                                 placeholder="Description of item/service"
                                />
                                <p className="text-sm text-red-600">{fields.item.errors}</p>
                            </div>
                            <div className="col-span-2">
                                <Input 
                                 name= {fields.itemQuantity.name}
                                 key= {fields.itemQuantity.key}
                                 value={quantity} //no need for default value because it is stored in the state already
                                 onChange={(e) => setQuantity(e.target.value)} //sets the value is the updated number (e) is the event
                                 placeholder="Qty" 
                                 type="number" 
                                />
                                <p className="text-sm text-red-600">{fields.itemQuantity.errors}</p>
                            </div>
                            <div className="col-span-2">
                                <Input 
                                 name={fields.itemPrice.name} 
                                 key={fields.itemPrice.key}
                                 value={price}
                                 onChange={(p) => setPrice(p.target.value)} //the updated values are now stored in the state, so no need to adda default value
                                 placeholder="Unit Price"
                                />
                                <p className="text-sm text-red-600">{fields.itemPrice.errors}</p>
                            </div>
                            <div className="col-span-2">
                                <Input 
                                 value={formatCurrency(calculateTotal, currency)}
                                 placeholder="Total" 
                                 disabled 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2">
                        <Label>Notes</Label>
                        <Textarea 
                         name={fields.notes.name}
                         key={fields.notes.key}
                         defaultValue={data.notes ?? undefined}
                         placeholder="Add any additional notes here" 
                        />
                    </div>

                    <div className="flex justify-end">
                        <div className="w-1/3">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>{formatCurrency(calculateTotal, currency)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-t">
                                <span>Total ({currency})</span>
                                <span className="font-medium">{formatCurrency(calculateTotal, currency)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center mt-6 justify-end">
                        <div>
                            <SubmitButton text="Save Changes" />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )

}