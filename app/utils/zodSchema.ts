import { z } from "zod";

export const onboardingschema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    businessName: z.string().optional(),
    addressLine1: z.string().min(1, { message: "Address Line 1 is required" }),
    addressLine2: z.string().optional(),
    city: z.string().min(1, { message: "City is required" }),
    province: z.string().min(1, { message: "Province is required" }),
    postalCode: z.string().min(1, { message: "Postal Code is required" }),
});

export const invoiceSchema = z.object({

   //invoice fields
  invoiceName: z.string().min(1, { message: "Invoice name is required" }),
  invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  status: z.enum(["PENDING", "PAID", "OVERDUE"]).default("PENDING"),
  issueDate: z.string().min(1, { message: "Issue date is required" }),
  dueDate: z.string().min(1, { message: "Due date is required" }),
  totalAmount: z.number({ invalid_type_error: "Total amount must be a number" }).min(0, { message: "Total amount must be at least 0" }),
  notes: z.string().optional(),
  terms: z.string().optional(),

  //item fields
  itemQuantity: z.number({ invalid_type_error: "Item quantity must be a number" }).min(1, { message: "Item quantity must be at least 1" }),
  itemPrice: z.number({ invalid_type_error: "Item price must be a number" }).min(0, { message: "Item price must be at least 0" }),
  item: z.string().min(1, { message: "Item description is required" }),

  //sender fields
  senderName: z.string().min(1, { message: "Sender name is required" }),
  senderEmail: z.string().email({ message: "Invalid email address" }),
  senderAddress: z.string().min(1, { message: "Sender address is required" }),

  //client fields
  receipientName: z.string().min(1, { message: "Receipient name is required" }),
  receipientEmail: z.string().email({ message: "Invalid email address" }),
  receipientAddress: z.string().min(1, { message: "Receipient address is required" }),
    
});