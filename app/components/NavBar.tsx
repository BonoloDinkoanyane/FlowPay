import Image from "next/image";
import Link from "next/link";
import FlowPay from "@/public/Flowpay.png"
import { buttonVariants } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";

export function NavBar(){
    return(
        <div className="flex items-center justify-between py-5">
            <Link 
             className="flex items-center gap-2"
             href={'/'}
             >
                <Image 
                 className="size-10 rounded-4xl"
                 src={FlowPay}
                 alt="FlowPay logo"
                />
                <h3 className="text-3xl font-semibold">
                    Flow<span className="text-blue-700">Pay</span>
                </h3>
            </Link>
            <Link 
             href={'/login'}
             >
                <RainbowButton>
                    Get Started
                </RainbowButton>
            </Link>
        </div>
    )
}