import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Sprout,
  Sofa,
  Wheat,
  Ship,
  Truck,
  ShoppingBasket,
  BarChart3,
  ShieldCheck,
  Cloud,
  Users,
  Zap,
  Award,
  Headphones,
  GraduationCap,
  RefreshCw,
  TrendingUp,
  Quote,
} from "lucide-react";
import SEO from "../components/SEO";
import { staticRouteMeta } from "../seo/routes";
import { SITE_URL } from "../seo/site";

const PB_LOGO = "/images/pb-logo.png";
const BC_LOGO = "/images/business-central-logo-newUpdated.png";
const DYNAMICS_DASHBOARD = "/images/DashboardUpdated.png";
const MS_PARTNER_LOGO = "/images/microsoft-dynamics-365Updated.png";

const industries = [
  {
    icon: Wheat,
    name: "Rice ERP",
    desc: "End-to-end mill operations — paddy procurement, drying, milling yield, by-products, warehousing and export invoicing.",
  },
  {
    icon: Sofa,
    name: "Furniture",
    desc: "BOM, made-to-order production, showroom POS, dealer network and after-sales service in one connected system.",
  },
  {
    icon: Sprout,
    name: "Nursery & Agri",
    desc: "Plant lifecycle, batch tracking, seasonal pricing, greenhouse inventory and B2B/B2C dispatch.",
  },
  {
    icon: ShoppingBasket,
    name: "FMCG",
    desc: "Fast-moving SKUs, schemes and discounts, secondary sales, van sales and route-wise profitability.",
  },
  {
    icon: Ship,
    name: "Export",
    desc: "Shipping docs, LC, BRC, drawback, forex, container tracking and DGFT-ready compliance.",
  },
  {
    icon: Truck,
    name: "Distribution",
    desc: "Multi-warehouse stock, primary & secondary sales, retailer app, credit control and beat planning.",
  },
];

const features = [
  { icon: BarChart3, title: "Finance & Accounting", desc: "Real-time GL, receivables, payables, cash-flow and multi-entity consolidation." },
  { icon: ShieldCheck, title: "GST & Compliance", desc: "GSTR-1, GSTR-3B, e-invoice, e-way bill and TDS built into every transaction." },
  { icon: Cloud, title: "Cloud & On-Prem", desc: "Deploy on Microsoft Cloud or your own servers with the same experience." },
  { icon: Users, title: "CRM & Sales", desc: "Lead-to-cash pipeline, quotes, orders and customer 360° insights." },
  { icon: Zap, title: "Power BI Analytics", desc: "Interactive dashboards for owners, plant heads and sales managers." },
  { icon: RefreshCw, title: "Data Migration", desc: "Clean migration from Tally, Busy, SAP B1, Navision and legacy systems." },
];

const whyUs = [
  { icon: Award, title: "Microsoft Partner", desc: "Certified Dynamics 365 Business Central implementation partner." },
  { icon: Headphones, title: "Dedicated Support", desc: "Named consultants and same-day response SLAs." },
  { icon: GraduationCap, title: "User Training", desc: "Role-based training so your team goes live confident." },
  { icon: TrendingUp, title: "Growth Partner", desc: "Scalable solutions that grow with your business and geographies." },
];

const testimonials = [
  {
    company: "Asharam & Sons",
    person: "Operations Director",
    text: "PunjabBulls transformed our rice mill operations with Dynamics 365. From paddy procurement to export invoicing, every process is now visible in real time. Their team understood our industry like no one else.",
  },
  {
    company: "KMI",
    person: "CEO",
    text: "The implementation was smooth, the training was excellent, and the post-go-live support is outstanding. Our decision-making speed has improved dramatically thanks to PunjabBulls.",
  },
  {
    company: "I-tek Logics",
    person: "Finance Head",
    text: "We needed a partner who could connect our sales, inventory and finance in one platform. PunjabBulls delivered a GST-compliant, scalable solution that grows with us.",
  },
  {
    company: "Trenchless",
    person: "Project Director",
    text: "Field operations, project costing and compliance are now fully integrated. PunjabBulls gave us the visibility we needed to deliver projects faster and more profitably.",
  },
  {
    company: "Featherlite",
    person: "VP Sales",
    text: "Our dealer network, showroom POS and after-sales service are now on one system. PunjabBulls understood furniture manufacturing and retail better than any ERP vendor we evaluated.",
  },
  {
    company: "Durian",
    person: "Managing Director",
    text: "Choosing PunjabBulls for our Dynamics 365 rollout was one of our best decisions. They customised the solution for our workflows and continue to support us with genuine dedication.",
  },
];

const faqs = [
  {
    q: "Which industries does PunjabBulls Technology serve?",
    a: "We deliver Microsoft Dynamics 365 Business Central and industry-tailored ERP for Rice mills, Furniture manufacturing, Nursery & Agriculture, FMCG, Export houses and Distribution networks.",
  },
  {
    q: "Do you offer Microsoft Dynamics 365 Business Central?",
    a: "Yes. We are a specialist Dynamics 365 Business Central partner offering licensing, implementation, customisation, integrations and post go-live support.",
  },
  {
    q: "Can you migrate our data from Tally or Busy?",
    a: "Yes. We migrate masters, opening balances and historical transactions from Tally, Busy, SAP Business One, Navision and Excel-based systems with full validation.",
  },
  {
    q: "Is on-premise deployment supported?",
    a: "Absolutely. We deploy on Microsoft Cloud, private cloud or your on-premise servers depending on your compliance and cost preferences.",
  },
  {
    q: "How do I get started?",
    a: "Call +91 9711270115 or email info@punjabbulls.com. We schedule a free discovery call within 24 hours.",
  },
];

const offices = [
  { city: "Ludhiana", addr: "Sco-5, Sua Road Opposite Canara Bank, Tharike, Jhande, Ludhiana, Punjab 141008" },
  { city: "Delhi", addr: "FE-30, Lower Ground Floor, Shivaji Enclave, New Delhi – 110027" },
  { city: "Delhi (Nehru Place)", addr: "508, Eros Apartment, 5th Floor, Building No. 56, Nehru Place, New Delhi" },
  { city: "Chandigarh", addr: "#841, Tricity Trade Tower, Patiala-Zirakpur Highway, Punjab 140603" },
  { city: "Mumbai", addr: "Dreamax Height, Jijabai Road, Andheri East, Mumbai – 400093" },
  { city: "Noida", addr: "Office No-2218, 22nd Floor, Ithum 73, Sector 73, Noida, Uttar Pradesh" },
];

export default function Landing() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const meta = staticRouteMeta["/"];

  const [form, setForm] = useState({
    name: "",
    email: "",
    businessName: "",
    phone: "",
    industry: "",
    industryOther: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${apiUrl}/api/leads`,
        {
          name: form.name,
          email: form.email,
          businessName: form.businessName,
          phone: form.phone,
          industry: form.industry === "Others" ? form.industryOther : form.industry,
          message: form.message,
          source: "landing-page",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setToast({
        type: "success",
        text: "Request received! Check your email — our team will call you within one business day.",
      });
      setForm({
        name: "",
        email: "",
        businessName: "",
        phone: "",
        industry: "",
        industryOther: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again or call us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] text-[#0f2418] font-sans">
      <SEO
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        canonical={meta.canonical}
        prerenderHint={meta.prerender}
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "PunjabBulls Technology Pvt. Ltd.",
          url: SITE_URL,
          logo: `${SITE_URL}/og-image.jpg`,
          sameAs: [
            "https://www.linkedin.com/company/punjabbullstechnologypvtltd-relax-erp/posts/?feedView=all",
          ],
        }}
      />

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] px-4 w-full max-w-md">
          <div
            className={`px-6 py-3 rounded-full text-sm shadow-lg text-center ${
              toast.type === "success" ? "bg-[#0f5132] text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast.text}
          </div>
        </div>
      )}

      {/* Top strip — Call bar */}
      <div className="bg-[#0f5132] text-white text-sm">
        <div className="mx-auto max-w-7xl px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-6">
            <a href="tel:+919711270115" className="inline-flex items-center gap-2 font-semibold hover:text-white/80">
              <Phone className="h-4 w-4" /> Call Now: +91 9711270115
            </a>
            <a href="mailto:info@punjabbulls.com" className="inline-flex items-center gap-2 hover:text-white/80">
              <Mail className="h-4 w-4" /> info@punjabbulls.com
            </a>
          </div>
          <Link
            to="/home"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-white text-[#0f5132] px-4 py-1 text-xs font-semibold hover:bg-white/90"
          >
            Explore Full Website <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#fcfbf8]/90 backdrop-blur border-b border-[#0f5132]/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src={PB_LOGO} alt="PunjabBulls Technology" className="h-16 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#about" className="hover:text-[#0f5132]">About</a>
            <a href="#industries" className="hover:text-[#0f5132]">Industries</a>
            <a href="#features" className="hover:text-[#0f5132]">Solutions</a>
            <a href="#why" className="hover:text-[#0f5132]">Why Us</a>
            <a href="#testimonials" className="hover:text-[#0f5132]">Clients</a>
            <a href="#locations" className="hover:text-[#0f5132]">Locations</a>
            <a href="#faq" className="hover:text-[#0f5132]">FAQ</a>
            <a href="#contact" className="hover:text-[#0f5132]">Contact</a>
          </nav>
          <Link
            to="/home"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-[#0f5132] text-white px-5 py-2 text-sm font-medium hover:bg-[#0d4429]"
          >
            Visit Full Website <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section id="contact" className="bg-[#0f5132] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24 grid md:grid-cols-2 gap-12">
          <div>
            <div className="mb-6 inline-flex items-center gap-4">
              <img src={MS_PARTNER_LOGO} alt="Microsoft Solutions Partner" className="h-20 w-auto rounded-lg bg-white/10 p-2" />
              <span className="text-white font-semibold text-base">Certified Microsoft Partner</span>
            </div>
            <div className="text-white/60 text-sm font-semibold tracking-widest">GET IN TOUCH</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-serif">
              Ready to modernise your business?
            </h2>
            <p className="mt-4 text-white/70 max-w-md">
              Talk to our Dynamics 365 specialists about your implementation, migration or
              training needs. We respond within one business day.
            </p>
            <div className="mt-10 space-y-6">
              <div className="flex gap-4 items-start">
                <Phone className="h-5 w-5 mt-1 text-white/70" />
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest text-white/60">Phone</div>
                  <div className="font-semibold">+91 9711270115</div>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="h-5 w-5 mt-1 text-white/70" />
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60">Email</div>
                  <div className="font-semibold">info@punjabbulls.com</div>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 mt-1 text-white/70" />
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60">Head Office</div>
                  <div className="font-semibold">PunjabBulls Technology Pvt. Ltd.</div>
                  <div className="text-white/80 text-sm mt-1">
                    FE-30, Lower Ground Floor, Shivaji Enclave,
                    <br />
                    New Delhi – 110027, India
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-3 gap-4 text-center">
              {[
                ["200+", "Implementations"],
                ["100%", "GST Compliant"],
                ["24×7", "Support"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl md:text-3xl font-serif">{n}</div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/60 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <form
            className="bg-white text-[#0f2418] rounded-3xl p-8 shadow-2xl space-y-4"
            onSubmit={handleSubmit}
          >
            <h3 className="text-2xl font-serif">Request a Free Demo</h3>
            <p className="text-sm text-[#0f2418]/60">Our team will contact you within 24 hours.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={updateField("name")}
                className="rounded-lg border border-[#0f5132]/20 px-4 py-3 focus:outline-none focus:border-[#0f5132]"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={updateField("email")}
                className="rounded-lg border border-[#0f5132]/20 px-4 py-3 focus:outline-none focus:border-[#0f5132]"
              />
              <input
                placeholder="Business name"
                value={form.businessName}
                onChange={updateField("businessName")}
                className="rounded-lg border border-[#0f5132]/20 px-4 py-3 focus:outline-none focus:border-[#0f5132]"
              />
              <input
                required
                placeholder="Phone number"
                value={form.phone}
                onChange={updateField("phone")}
                className="rounded-lg border border-[#0f5132]/20 px-4 py-3 focus:outline-none focus:border-[#0f5132]"
              />
            </div>
            <select
              value={form.industry}
              onChange={updateField("industry")}
              className="w-full rounded-lg border border-[#0f5132]/20 px-4 py-3 bg-white"
            >
              <option value="">Select your industry</option>
              {industries.map((i) => (
                <option key={i.name} value={i.name}>{i.name}</option>
              ))}
              <option value="Others">Others</option>
            </select>
            {form.industry === "Others" && (
              <input
                required
                maxLength={200}
                placeholder="Please describe your business"
                value={form.industryOther}
                onChange={updateField("industryOther")}
                className="w-full rounded-lg border border-[#0f5132]/20 px-4 py-3 focus:outline-none focus:border-[#0f5132]"
              />
            )}
            <textarea
              rows={3}
              placeholder="Tell us about your requirement"
              value={form.message}
              onChange={updateField("message")}
              className="w-full rounded-lg border border-[#0f5132]/20 px-4 py-3 focus:outline-none focus:border-[#0f5132]"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0f5132] text-white px-6 py-3 font-semibold hover:bg-[#0d4429] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending..." : "Request Callback"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </section>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f5132] via-[#0d4429] to-[#082a1a]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,white,transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center text-white">
          <div>
            <img
              src={BC_LOGO}
              alt="Microsoft Dynamics 365 Business Central"
              className="h-16 md:h-20 w-auto mb-6 object-contain drop-shadow-lg"
            />
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs tracking-widest uppercase">
              Microsoft Dynamics 365 Partner
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-serif leading-[1.05]">
              Modern ERP for India's growing industries.
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-xl">
              PunjabBulls Technology Pvt. Ltd. delivers Microsoft Dynamics 365 Business
              Central and industry-tailored ERP for Rice mills, Furniture, Nursery,
              FMCG, Export and Distribution businesses — with end-to-end
              implementation, customisation and support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-white text-[#0f5132] px-6 py-3 font-semibold hover:bg-white/90"
              >
                Book a Free Demo <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/home"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold hover:bg-white/10"
              >
                Explore Full Website <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                ["200+", "Implementations"],
                ["100%", "GST compliant"],
                ["24×7", "Support"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl md:text-3xl font-serif">{n}</div>
                  <div className="text-xs uppercase tracking-widest text-white/60 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-white/5 rounded-3xl blur-2xl" />
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
              <img src={BC_LOGO} alt="Microsoft Dynamics 365 Business Central" className="h-20 md:h-24 w-auto mx-auto object-contain" />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-serif text-[#0f2418]">Authorised Dynamics 365 Partner</h3>
                <p className="mt-2 text-sm text-[#0f2418]/70">
                  Licensing, implementation, customisation and lifetime support.
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-[#0f2418]/80">
                {["Business Central", "Sales & CRM", "Power BI Analytics", "Azure Cloud"].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0f5132]" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <img
              src={DYNAMICS_DASHBOARD}
              alt="Microsoft Dynamics 365 Business Central dashboard"
              className="w-full rounded-2xl shadow-lg"
            />
            <div className="absolute -bottom-4 right-6 bg-white shadow-xl rounded-xl px-5 py-3 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-[#0f5132]" />
              <div>
                <div className="text-[#0f5132] font-semibold">+45% ROI</div>
                <div className="text-xs text-[#0f2418]/60">Average client efficiency gain</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[#0f5132] text-sm font-semibold tracking-widest">ABOUT PUNJABBULLS</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-serif leading-tight">
              Mastering Microsoft Dynamics 365 Business Central
            </h2>
            <p className="mt-6 text-[#0f2418]/70 leading-relaxed">
              Unify your data, people and processes with modern, intelligent business
              applications. PunjabBulls Technology specialises in seamless Dynamics 365
              integration that adapts to your changing needs — with end-to-end
              implementation, customisation, data migration and user training.
            </p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Intelligent Sales & Marketing",
                "Proactive Customer Service",
                "Connected Field Service",
                "Finance, HR & Supply Chain",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-[#0f5132]" /> {b}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0f5132] px-6 py-3 text-white font-medium hover:bg-[#0d4429]"
            >
              Explore Dynamics Solutions <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="bg-white border-y border-[#0f5132]/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <div className="text-[#0f5132] text-sm font-semibold tracking-widest">INDUSTRIES WE SERVE</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-serif">
              Built for the way your industry actually runs
            </h2>
            <p className="mt-4 text-[#0f2418]/70">
              Beyond generic ERP — our solutions are pre-configured for the real workflows,
              compliance and reporting each sector needs.
            </p>
          </div>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((i) => (
              <div
                key={i.name}
                className="group rounded-2xl border border-[#0f5132]/10 bg-[#fcfbf8] p-8 hover:border-[#0f5132]/30 hover:shadow-lg transition"
              >
                <div className="h-12 w-12 rounded-xl bg-[#0f5132]/10 text-[#0f5132] flex items-center justify-center group-hover:bg-[#0f5132] group-hover:text-white transition">
                  <i.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-serif">{i.name}</h3>
                <p className="mt-2 text-sm text-[#0f2418]/70 leading-relaxed">{i.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 rounded-full bg-[#0f5132] text-white px-8 py-4 font-semibold hover:bg-[#0d4429] shadow-lg"
            >
              Explore Full Website <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[#0f5132] text-sm font-semibold tracking-widest">SOLUTIONS</div>
          <h2 className="mt-3 text-4xl md:text-5xl font-serif">Everything your business needs</h2>
          <p className="mt-4 text-[#0f2418]/70">
            One connected platform for finance, operations, sales and analytics — powered by
            Microsoft Dynamics 365.
          </p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl bg-white border border-[#0f5132]/10 p-8">
              <f.icon className="h-8 w-8 text-[#0f5132]" />
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-[#0f2418]/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section id="why" className="bg-[#0f5132] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <div className="mb-6">
              <img src={BC_LOGO} alt="Microsoft Dynamics 365 Business Central" className="h-20 md:h-24 w-auto object-contain" />
            </div>
            <div className="text-white/60 text-sm font-semibold tracking-widest">WHY PUNJABBULLS</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-serif leading-tight">
              A partner invested in your growth
            </h2>
            <p className="mt-4 text-white/70">
              We don't just deploy software — we align it to your business goals, train your
              people and stay with you long after go-live.
            </p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            {whyUs.map((w) => (
              <div key={w.title} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <w.icon className="h-7 w-7 text-white" />
                <h3 className="mt-4 text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-white/70">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-[#fcfbf8] border-y border-[#0f5132]/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-[#0f5132] text-sm font-semibold tracking-widest">TRUSTED BY LEADING BRANDS</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-serif">What our clients say</h2>
            <p className="mt-4 text-[#0f2418]/70">
              Real feedback from businesses that have grown with PunjabBulls Technology.
            </p>
          </div>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.company}
                className="rounded-2xl bg-white border border-[#0f5132]/10 p-8 hover:shadow-xl transition flex flex-col"
              >
                <Quote className="h-8 w-8 text-[#0f5132]/30" />
                <p className="mt-4 text-[#0f2418]/80 leading-relaxed flex-1">"{t.text}"</p>
                <div className="mt-6 pt-6 border-t border-[#0f5132]/10">
                  <div className="font-semibold text-[#0f5132]">{t.company}</div>
                  <div className="text-sm text-[#0f2418]/60">{t.person}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices / Locations */}
      <section id="locations" className="bg-[#fcfbf8] border-y border-[#0f5132]/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-[#0f5132] text-sm font-semibold tracking-widest">OUR PRESENCE</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-serif">Our Offices in India</h2>
            <p className="mt-4 text-[#0f2418]/70">
              Nationwide presence to serve your business with local expertise.
            </p>
          </div>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offices.map((o) => (
              <div key={o.city} className="rounded-2xl border border-[#0f5132]/15 bg-white p-6 hover:shadow-lg transition">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#0f5132]/10 text-[#0f5132] flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{o.city}</h3>
                </div>
                <p className="mt-4 text-sm text-[#0f2418]/70 leading-relaxed">{o.addr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center">
          <div className="text-[#0f5132] text-sm font-semibold tracking-widest">FAQ</div>
          <h2 className="mt-3 text-4xl md:text-5xl font-serif">Frequently asked questions</h2>
        </div>
        <div className="mt-12 divide-y divide-[#0f5132]/10 border-y border-[#0f5132]/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex justify-between items-center cursor-pointer list-none font-medium text-lg">
                {f.q}
                <span className="ml-4 text-[#0f5132] group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-[#0f2418]/70 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}

      {/* Footer */}
      <footer className="bg-[#0a3d24] text-white text-sm">
        <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-10">
          <div>
            <img src={PB_LOGO} alt="PunjabBulls" className="h-20 w-auto bg-white rounded-lg p-2" />
            <p className="mt-5 text-white/70 leading-relaxed">
              PunjabBulls Technology Pvt. Ltd. — Microsoft Dynamics 365 & industry ERP
              solutions across India.
            </p>
            <Link
              to="/home"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/20"
            >
              Visit Full Website <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <div className="text-white font-semibold text-base mb-4">Quick links</div>
            <ul className="space-y-3">
              <li><a href="#about" className="text-white/70 hover:text-white transition">About</a></li>
              <li><a href="#industries" className="text-white/70 hover:text-white transition">Industries</a></li>
              <li><a href="#features" className="text-white/70 hover:text-white transition">Solutions</a></li>
              <li><a href="#contact" className="text-white/70 hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold text-base mb-4">Contact</div>
            <div className="space-y-3 text-white/70">
              <p>+91 9711270115</p>
              <p>info@punjabbulls.com</p>
              <p className="leading-relaxed">
                FE-30, Lower Ground Floor,<br />
                Shivaji Enclave, New Delhi – 110027
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-5 text-center text-white/50">
            © {new Date().getFullYear()} PunjabBulls Technology Pvt. Ltd. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/919711270115"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#1ebe57] hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
          <path d="M19.11 17.44c-.29-.14-1.7-.84-1.96-.93-.26-.1-.45-.14-.64.14-.19.29-.74.93-.9 1.12-.17.19-.33.22-.62.07-.29-.14-1.22-.45-2.32-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.39s1.02 2.77 1.16 2.96c.14.19 2.01 3.07 4.87 4.31.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33zM16.02 5.33h-.01c-5.9 0-10.7 4.8-10.7 10.7 0 1.88.49 3.72 1.42 5.34L5.24 26.67l5.44-1.43a10.66 10.66 0 0 0 5.33 1.43h.01c5.9 0 10.7-4.8 10.7-10.7 0-2.86-1.11-5.55-3.14-7.57a10.62 10.62 0 0 0-7.56-3.07zm0 19.6c-1.72 0-3.4-.46-4.87-1.34l-.35-.21-3.23.85.86-3.15-.23-.36a8.89 8.89 0 0 1-1.36-4.7c0-4.91 4-8.9 8.9-8.9a8.87 8.87 0 0 1 8.9 8.9c0 4.91-4 8.91-8.9 8.91z" />
        </svg>
      </a>
    </div>
  );
}
