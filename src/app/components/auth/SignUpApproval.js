"use client"

import Link from "next/link"
import Card from "../card/Card"

export default function SignUpApproval() {
    return (
        <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-12">
            <div className="flex flex-col justify-center items-center w-full max-w-md sm:max-w-lg lg:max-w-2xl">
                <Card bold="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-center px-6 sm:px-8 py-8 sm:py-12">
                    THANK YOU!
                    <br />
                    <span className="text-lg sm:text-xl lg:text-2xl mt-4 block">WAITING FOR APPROVAL</span>
                </Card>
                <Link href="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Return Home
                </Link>
            </div>
        </div>
    )
}