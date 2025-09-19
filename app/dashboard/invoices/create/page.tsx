//the create page is a client component
//so we dont want our secrets to be rendered on the front end
//so we perform funtions in there, and call the create invoice function here

import { CreateInvoice } from "@/app/components/CreateInvoice";

export default function CreateInvoicePage() {
    return(
        <CreateInvoice />
    );
}