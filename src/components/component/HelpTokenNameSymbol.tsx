import Image from "next/image";

const HelpTokenNameSymbol = () => {
    return(
        <div className="overflow-hidden flex-1">
            <Image alt="helpTokenNameSymbol" src="/helpTokenNameSymbol.png" width={400} height={200}
                className="w-full hidden md:block"
            />
            <Image alt="helpTokenNameSymbol" src="/helpTokenNameSymbolMobile.png" width={400} height={200}
                className="w-full block md:hidden"
            />
        </div>
    )
}
export default HelpTokenNameSymbol;