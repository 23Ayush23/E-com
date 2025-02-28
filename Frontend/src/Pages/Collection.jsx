import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showfilter, setShowfilter] = useState(false);
  //state variable for displaying all products
  const [filteredProduct,setFilteredProduct] = useState([])
  //state variable for displaying filtered produxt

  //Men Women Kids
  const [category,setCategory] = useState([])
  //Top wear bottom wear winter wear
  const [subCategory,setSubCategory] = useState([])
  //state for high-low low-high
  const [sortType,setSortType] = useState('relavent')

  //function to provide selected filtered products
  const toggleCategory = (event) => {
    if(category.includes(event.target.value)){
      setCategory(prev=> prev.filter(item => item !== event.target.value))
    }
    else{
      setCategory(prev=> [...prev,event.target.value])
    }
  }

   //function to provide selected Subcategory products
   const toggleSubCategory = (event) => {
    if(subCategory.includes(event.target.value)){
      setSubCategory(prev=> prev.filter(item => item !== event.target.value))
    }
    else{
      setSubCategory(prev=> [...prev,event.target.value])
    }
  }

    //function to display filterd products
    const applyFilter =  () => {
      // All products appended 
      let allProduct = products.slice()

      // filter according to searching the product name
      if(showSearch && search) {
        allProduct = 
        allProduct.filter(item=> item.name.toLowerCase().includes(search.toLowerCase()))
      }

      if (category.length>0) // someone selected category
        {
          allProduct = allProduct.filter(item=> category.includes(item.category))
        }

        if (subCategory.length>0) // someone selected category
        {
          allProduct = allProduct.filter(item=> subCategory.includes(item.subCategory))
        }
        setFilteredProduct(allProduct)
    }

      //function to filter product from low-high / relevant

    const  sortProduct = () => {

      let filterdcopy = filteredProduct.slice()

      switch(sortType){
        case 'low-high' :
          setFilteredProduct(filterdcopy.sort((a,b)=>(a.price - b.price)))
          break;

        case 'high-low' :
          setFilteredProduct(filterdcopy.sort((a,b)=>(b.price - a.price)))
          break;

        default:
          applyFilter();
          break;
      }
        }

  // useEffect(()=>{
  //   setFilteredProduct(products)
  // },[products])

  // useEffect for affecting filers: category / subCategory
  useEffect(()=>{
    applyFilter()
  },[category,subCategory,search,showSearch,products])

  // useEffect for affecting filters: high-low / low-high
  useEffect(()=>{
    sortProduct()
  },[sortType])  

  // useEffect(()=>{
  //   console.log(category);
  //   },[category])

  //   useEffect(()=>{
  //     console.log(subCategory);
  //     },[subCategory])


  return (
    <div className='mb-5 bg-[#f4f4f6]'>
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Section */}
<div className="min-w-[250px] sticky top-20 h-[calc(100vh-80px)] overflow-y-auto bg-white shadow-md p-4">
  {/* Filter Toggle */}
  <p 
    onClick={() => setShowfilter(!showfilter)} 
    className="my-2 text-xl flex items-center cursor-pointer gap-2"
  >
    Filters
    <img 
      className={`h-3 sm:hidden transition-transform duration-200 ${showfilter ? 'rotate-90' : ''}`} 
      src={assets.dropdown_icon} 
      alt="Dropdown Icon" 
    />
  </p>

  {/* Category Filter */}
  <div className="border border-gray-300 pl-5 pt-3 mt-6">
    <p className="mb-3 text-sm font-medium">Categories</p>
    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
      <p className="flex gap-2">
        <input className="w-3" type="checkbox" value="Men" onChange={toggleCategory} />
        Men
      </p>
      <p className="flex gap-2">
        <input className="w-3" type="checkbox" value="Women" onChange={toggleCategory} />
        Women
      </p>
      <p className="flex gap-2">
        <input className="w-3" type="checkbox" value="Kids" onChange={toggleCategory} />
        Kids
      </p>
    </div>
  </div>

  {/* Subcategory Filter */}
  <div className="border border-gray-300 pl-5 pt-3 my-5">
    <p className="mb-3 text-sm font-medium">Types</p>
    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
      <p className="flex gap-2">
        <input className="w-3" type="checkbox" value="Topwear" onChange={toggleSubCategory} />
        Topwear
      </p>
      <p className="flex gap-2">
        <input className="w-3" type="checkbox" value="Bottomwear" onChange={toggleSubCategory} />
        Bottomwear
      </p>
      <p className="flex gap-2">
        <input className="w-3" type="checkbox" value="Winterwear" onChange={toggleSubCategory} />
        Winterwear
      </p>
    </div>
  </div>
</div>


          {/* aright Side:- Displaying Products: */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'All '} text2={'Collection'}/>
          {/* Product Sortby section:- high-low,low-high */}
          <select onChange={(e)=>setSortType(e.target.value)} className='border border-gray-300 text-sm sm:text-base px-2 py-1 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400'>
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low-High</option>
            <option value="highh-low">Sort by: high-Low</option>
          </select>
        </div>

            {/* Appending product using map */}
        <div className='grid grid-cols-2 md:grid-cold-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filteredProduct.map((item,index)=>(
              <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} productStock={item.productStock}/>
            ))
          }
        </div>

      </div>
      
    </div>
</div>
  );
};

export default Collection;
