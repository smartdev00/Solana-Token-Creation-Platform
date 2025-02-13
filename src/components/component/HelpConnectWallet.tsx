import Image from "next/image";

const HelpConnectWallet = () => {
    return(
        <div className="overflow-hidden flex-1 relative">
            <Image alt="helpConnectWallet" src="/helpConnectWallet.png" width={1000} height={400}
                className="w-full hidden md:block absolute bottom-0"
            />
            <Image alt="helpConnectWallet" src="/helpConnectWalletMobile.png" width={1000} height={400}
                className="w-full block md:hidden"
            />
        </div>
    )
}
export default HelpConnectWallet;