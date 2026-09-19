import React from 'react'
import {
  LayoutGrid,
  Smartphone,
  Backpack,
  Wallet,
  KeyRound,
  BookOpen,
  Shirt,
  Watch
} from 'lucide-react'

const Categories = () => {

    const categories = [
  { name: 'All Items', icon: LayoutGrid, color: 'text-green-500' },
  { name: 'Electronics', icon: Smartphone, color: 'text-blue-500' },
  { name: 'Bags', icon: Backpack, color: 'text-purple-500' },
  { name: 'Wallets', icon: Wallet, color: 'text-yellow-500' },
  { name: 'Keys', icon: KeyRound, color: 'text-orange-500' },
  { name: 'Books', icon: BookOpen, color: 'text-blue-500' },
  { name: 'Clothing', icon: Shirt, color: 'text-pink-500' },
  { name: 'Accessories', icon: Watch, color: 'text-cyan-500' },
]
  return (
    <div className='mx-4 sm:mx-6 md:mx-10 lg:mx-16 xl:mx-24 mt-10'>
       <div className='flex justify-between items-center mb-4 left-20 right-2'>
        <h1 className='text-black text-lg font-semibold'>Categories</h1>

        <button className='text-blue-500 cursor-pointer'>View all</button>
       </div>


       <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3'>
        {categories.map((category,index) => {
           const Icon =  category.icon


           return (
            <div
            key={index}
            className='flex flex-col rounded-lg p-3 bg-white border border-gray-300 gap-2 items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer '
            >
                <Icon
                 size={24}
                strokeWidth={1.8}
                className={category.color}
                />

                <p className='text-semibold text-black'>{category.name}</p>
            </div>
           )
        })}



       </div>

      
    </div>
  )
}

export default Categories
