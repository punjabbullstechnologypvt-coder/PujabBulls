
import CTA from '../components/Home/CTA'
import Hero from '../components/Home/Hero'
import Service from '../components/Home/Service'
import Spotlight from '../components/Home/Spotlight'
import Timeline from '../components/Home/Timeline'
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
    <Helmet>
       <link rel="canonical" href="https://www.punjabbulls.com/" />
    </Helmet>
    <Hero/>
    <Service/>
    <Spotlight/>
    <Timeline/>
    {/* <Testimonial/> */}
    <CTA/>
    </>
  )
}

export default Home