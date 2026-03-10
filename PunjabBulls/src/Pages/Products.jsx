import React from 'react'
import ProductHero from '../components/Products/ProductHero'
import ProductNav from '../components/Products/ProductNav'
import Dynamics from '../components/Products/Dynamics'
import StockSales from '../components/Products/StockSales'
import GST from '../components/Products/GST'
import TCS from '../components/Products/TCS'
import RiceERP from '../components/Products/RiceERP'
import ProductCTA from '../components/Products/ProductCTA'
import { Helmet } from "react-helmet-async";

const Products = () => {
  return (
    <>
<Helmet>
  <title>ERP & CRM Products | Microsoft Dynamics 365, StockSales, RiceERP – PunjabBulls</title>
  <meta name="description" content="Explore PunjabBulls' suite of enterprise products including Microsoft Dynamics 365 Business Central, StockSales, RiceERP, and GST compliance tools." />
  <link rel="canonical" href="https://www.punjabbulls.com/products" />
</Helmet>
      <ProductHero />
      <ProductNav />
      <Dynamics />
      <StockSales />
      <RiceERP />
      <GST />
      {/* <TCS /> */}
      <ProductCTA />
    </>
  )
}

export default Products