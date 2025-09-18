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
import { useActionState, useState } from "react";
import { SubmitButton } from "./SubmitButtons";
import { createInvoice } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "../utils/zodSchema";

export function CreateInvoice() {

    const [lastResult, action] = useActionState(createInvoice, undefined);
    const [form, fields] = useForm({
        //last result syncs the form with the server action
        lastResult, 
        
        onValidate({formData}) {
            return parseWithZod(formData, {
                schema: invoiceSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    const [selectedDate, setSelectedDate]= useState(new Date());

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <form id={form.id} 
                 action={action} 
                 noValidate 
                 onSubmit={form.onSubmit}
                >
                    <div className="flex flex-col gap-1 w-fit mb-6">
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary">draft</Badge>
                            <Input 
                             placeholder="est" 
                             name= {fields.invoiceName.name} 
                             key= {fields.invoiceName.key} 
                             defaultValue={fields.invoiceName.initialValue}
                             />
                        </div>
                        <p className="text-sm text-red-600">{fields.invoiceName.errors}</p>
                    </div>
                    {/* layout wrapper div */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <Label>Invoice No.</Label>
                            <div className="flex">
                                <span className="px-3 border border-r-0 rounded-l-md">#</span>
                                <Input className="rounded-l-none" placeholder="001" />
                            </div>
                        </div>

                        <div>
                            <Label>Currrency</Label>
                            <Select defaultValue="zar">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="zar">ZAR</SelectItem>
                                    <SelectItem value="usd">United States Dollar</SelectItem>                                
                                    <SelectItem value="eur">EUR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label>From</Label>
                            <div className="space-y-2">
                                <Input placeholder="Your Name, or Company Name" />
                                <Input placeholder="Your Email" />
                                <Input placeholder="Your Address" />
                            </div>
                        </div>

                        <div>
                            <Label>Receipient</Label>
                            <div className="space-y-2">
                                <Input placeholder="Receipient Name, or Company Name" />
                                <Input placeholder="Client Email" />
                                <Input placeholder="Client Address" />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <div>
                            <Label>Invoice Date</Label>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[280px] text-left justify-start">
                                        <Calendar1Icon /> 
                                        {selectedDate ? (
                                            new Intl.DateTimeFormat("en-ZA", {
                                                dateStyle: "long", 
                                            }).format(selectedDate)
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar 
                                    mode="single" 
                                    selected={selectedDate}
                                    onSelect={(date) => setSelectedDate(date || new Date())}
                                    disabled={{before: new Date()}}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="w-[280px] text-left justify-start">
                            <Label>Due Date</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select due date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 Day</SelectItem>
                                    <SelectItem value="3">14 Days</SelectItem>
                                    <SelectItem value="7">30 Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <div className="grid md:grid-cols-12 gap-4 mb-2 font-medium">
                            <p className="col-span-6">Item</p>
                            <p className="col-span-2">Quantity</p>
                            <p className="col-span-2">Unit Price</p>
                            <p className="col-span-2">Total</p>
                        </div>

                        <div className="grid md:grid-cols-12 gap-4 mb-2">
                            <div className="col-span-6">
                                <Input placeholder="Description of item/service" />
                            </div>
                            <div className="col-span-2">
                                <Input placeholder="Qty" type="number" />
                            </div>
                            <div className="col-span-2">
                                <Input  placeholder="Unit Price" />
                            </div>
                            <div className="col-span-2">
                                <Input placeholder="Total" disabled />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-1/3">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>r 5</span>
                            </div>
                            <div className="flex justify-between py-2 border-t">
                                <span>Total</span>
                                <span className="font-medium">R 5</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label>Notes</Label>
                        <Textarea placeholder="Add any additional notes here" />
                    </div>

                    <div className="flex items-center mt-6 justify-end">
                        <div>
                            <SubmitButton text="Create Invoice" />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}