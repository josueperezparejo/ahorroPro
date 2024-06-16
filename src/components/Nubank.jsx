import { Avatar } from "@nextui-org/react";
import '../index.css'

export const Nubank = () => {
    return (
        <div className="mt-6 flex flex-wrap justify-center">
            <div className="flex gap-4 items-center">
                <p className="text-left font-semibold text-purple-800">inspired by</p>
                <Avatar src={"assets/nubank.jpg"} className="w-10 h-10 text-large" />
            </div>
        </div>
    );
}
