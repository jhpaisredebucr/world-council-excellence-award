export default function Loading(){


    return(
    <div className="w-full flex">
        <div className="w-full ml-0 md:ml-56 px-4 md:px-8 lg:px-20 py-7 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-dashed rounded-full animate-spin"></div>
                <div className="text-xl text-gray-700">Loading...</div>
            </div>
        </div>
    </div>
    )
}