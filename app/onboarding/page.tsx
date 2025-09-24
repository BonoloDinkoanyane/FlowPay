"use client"; 

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../components/SubmitButtons";
import { useActionState } from "react";
import { onboardUser } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingschema } from "../utils/zodSchema";
import { redirect } from "next/navigation";

export default function Onboarding(){
    const [lastResult, action] = useActionState(onboardUser, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}) {
            return parseWithZod(formData,{
                schema: onboardingschema,
            })
        }, 
        shouldValidate: "onBlur", //validates when we click out of the input field
        shouldRevalidate: "onInput", //revalidates when we type in the input field
    });

    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 
                [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
            </div>
            <Card className="max-w-sm mx-auto">
                <CardHeader className="">
                    <CardTitle className="text-xl">
                        You are almost done!
                    </CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4"
                      action={action}
                      id={form.id}
                      onSubmit={form.onSubmit}
                      noValidate 
                      >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label> First Name: </Label>
                                <Input
                                 name={fields.firstName.name}
                                 key={fields.firstName.key}
                                 defaultValue={fields.firstName.initialValue}
                                 placeholder="John"
                                 />
                                 <p className="text-sm text-red-600">
                                    {fields.firstName.errors}
                                 </p>
                            </div>
                            <div className="grid gap-2">
                                <Label> Last Name: </Label>
                                <Input
                                 name={fields.lastName.name}
                                 key={fields.lastName.key}
                                 defaultValue={fields.lastName.initialValue}
                                 placeholder="Doe"
                                 />
                                 <p className="text-sm text-red-600">
                                    {fields.lastName.errors}
                                 </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Business Name:</Label>
                            <Input
                             name={fields.businessName.name}
                             key={fields.businessName.key}
                             defaultValue={fields.businessName.initialValue}
                             placeholder="Acme Inc."
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Address Line 1:</Label>
                            <Input
                             name={fields.addressLine1.name}
                             key={fields.addressLine1.key}
                             defaultValue={fields.addressLine1.initialValue}
                             placeholder="123 Main Street"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Address Line 2 (optional):</Label>
                            <Input
                             name={fields.addressLine2.name}
                             key={fields.addressLine2.key}
                             defaultValue={fields.addressLine2.initialValue}
                             placeholder="Apartment, suite, unit, etc."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>City:</Label>
                                <Input
                                 name={fields.city.name}
                                 key={fields.city.key}
                                 defaultValue={fields.city.initialValue}
                                 placeholder="Cape Town"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Postal Code:</Label>
                                <Input
                                 name={fields.postalCode.name}
                                 key={fields.postalCode.key}
                                 defaultValue={fields.postalCode.initialValue}
                                 placeholder="8000"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                                <Label>State/Province:</Label>
                                <Input
                                 name={fields.province.name}
                                 key={fields.province.key}
                                 defaultValue={fields.province.initialValue}
                                 placeholder="Western Cape"
                                />
                        </div>
                        <SubmitButton text="Finish"/>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}