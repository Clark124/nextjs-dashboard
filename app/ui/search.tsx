'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';


// function debounce(fn:Function,delay:number=500){
//   let timer: string | number | NodeJS.Timeout | null | undefined = null
//   return (...args: any) =>{
//     if(timer){
//       clearTimeout(timer)
//     }
//     timer = setTimeout(()=>{
//       fn.apply(this,args)
//       timer = null
//     },delay)
//   }
// }


export default function Search({ placeholder }: { placeholder: string }) {
  const router  = useRouter()
  const pathname = usePathname()   //   /dashboard/invoices
  const searchParams = useSearchParams()  //?query=mi

  const handleSearch =  useDebouncedCallback((term:string|number)=>{
    const params = new URLSearchParams(searchParams.toString())
    params.set('page','1')
    
    if(term){
      params.set('query',term.toString())
    }else {
      params.delete('query')
      params.delete('page')
    }
   
    router.replace(`${pathname}?${params}`)
  },300)
  
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e)=>handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
       
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
