//the create page is a client component
//so we dont want our secrets to be rendered on the front end
//so we perform funtions in there, and call the create invoice function here

import { CreateInvoice } from "@/app/components/CreateInvoice";
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";

async function getUserdata(userId: string){
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            firstName: true,
            lastName: true,
            email: true,
            businessName: true,
            addressLine1: true,
        }
    });

    return data;
}

export default async  function CreateInvoicePage() {

    const session = await requireUser();
    const data = await getUserdata(session.user?.id as string);

    return(
        <CreateInvoice 
         lastName={data?.lastName!}
         firstName={data?.firstName!}
         email= {data?.email!}
         businessName={data?.businessName!}
         addressLine1={data?.addressLine1!}
        />
    );
}