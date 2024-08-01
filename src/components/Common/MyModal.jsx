import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { useLoading } from '../../context/LoadingContext'

export default function MyModal({isOpen,setIsModalOpen,title,message,handlePilgrimDelete,id}) {


  // function open() {
  //   setIsOpen(true)
  // }

  // function close() {
  //   setIsOpen(false)
  // }

  return (
    <>
       <Dialog open={isOpen} as="div" className="relative z-10 ml-2 text-center text-black focus:outline-none" onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 z-10 overflow-y-auto " >
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-4xl rounded-xl bg-white/5 backdrop-blur-2xl p-6 border duration-300 ease-out transform transition-transform data-[closed]:scale-95 data-[closed]:opacity-0">
              <DialogTitle as="h3" className="text-lg font-medium text-black">
                {title}
              </DialogTitle>
              <p className="mt-2 text-sm text-black">
                {message}
              </p>
              <div className="mt-4 flex gap-4 justify-center text-center">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-lime-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600 focus:outline focus:outline-1 focus:outline-white open:bg-gray-700"
                  onClick={() => handlePilgrimDelete(id)}
                >
                  Yes
                </Button>
                <Button
                  className="inline-flex items-center gap-2 ml-3 rounded-md bg-red-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600 focus:outline focus:outline-1 focus:outline-white open:bg-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  No
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* <Dialog open={isOpen} as="div" className="relative z-10 text-black focus:outline-none border border-dotted" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto border border-double">
          <div className="flex min-h-full items-center justify-center p-4 ">
            <DialogPanel
              transition
              className="w-full  max-w-xl rounded-xl bg-white/5  backdrop-blur-2xl p-6 border border-solid duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-black">
               {title}
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-black">
                {message}
              </p>
              <div className="mt-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-lime-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={()=>handlePilgrimDelete(id)}
                >
                Yes
                </Button>
                <Button
                  className="inline-flex items-center gap-2 ml-3 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={()=>setIsModalOpen(false)}
                >
                 No
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog> */}
    </>
  )
}
