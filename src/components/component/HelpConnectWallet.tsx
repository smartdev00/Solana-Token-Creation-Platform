import Image from "next/image";

const HelpConnectWallet = () => {
    return(
        <div className="overflow-hidden">
            <Image alt="helpConnectWallet" src="/helpConnectWallet.png" width={1000} height={400}
                className="scale-[200%] md:scale-110 mt-[12vw] -ml-[35vw] md:ml-0 md:mt-[4.5vw] lg:mt-[6vw] md:bottom-0"
            />
        </div>
    )
}
export default HelpConnectWallet;