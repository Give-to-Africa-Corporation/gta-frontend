
// @ts-nocheck
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  ChevronDown,
  Cross,
  Crosshair,
  CrossIcon,
} from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { Link } from "react-router-dom";

export default function PricingPage() {
  return (
    <>
      <div className="w-full bg-background text-foreground">
        {/* HERO */}
        <section className="py-20 text-center mx-auto">
          {/* <h1 className="text-4xl md:text-5xl font-bold mb-4">
            YENDAA PRICING & FEATURES PAGE
          </h1>
          <p className="text-muted-foreground mb-8">
            Digital Giving for Africa — made simple, affordable, and built for
            impact.
          </p> */}
          {/* <div className="bg-gray-100 p-12"> */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Maximize impact, minimize costs.
          </h1>
          <p className="text-muted-foreground mb-8">
            Experience a modern digital giving platform — created by a
            nonprofit, for nonprofits across Africa.
          </p>
          <Link to={"/signup"}>
            <Button size="lg" className="rounded-full px-8">
              Get started
            </Button>
          </Link>
          {/* </div> */}
        </section>

        {/* TRANSACTION FEES */}
        <section className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10 items-center relative">
          <Card className="shadow-lg border-none p-4 z-10">
            <CardHeader>
              <CardTitle>Transparent Pricing</CardTitle>
              <CardDescription>
                Yendaa supports global online donations with low processing fees
                to ensure more money reaches African nonprofits.
              </CardDescription>
              <CardTitle className="mt-3 text-[16px]">
                Transaction Type & Processing Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[15px] text-bold">Transaction Type</span>
                <span className="text-[15px] text-bold">Processing Fee</span>
              </div>
              <div className="flex justify-between">
                <span>Bank ACH</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Visa / Mastercard / Discover</span>
                <span>2.2% + $0.30 (+1% outside US)</span>
              </div>
              <div className="flex justify-between">
                <span>American Express</span>
                <span>3.5% (+1% outside US)</span>
              </div>
              <div className="flex justify-between">
                <span>PayPal / Venmo</span>
                <span>1.99% (+1.5% outside US)</span>
              </div>
              <div className="flex justify-between">
                <span>Apple Pay / Google Pay</span>
                <span>Standard card fees apply</span>
              </div>
            </CardContent>
          </Card>
          <img
            src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/66703674a5a268dcdbfaccbb_bg-4.png"
            loading="lazy"
            width="206"
            height="304"
            alt=""
            className="bg-4"
          />

          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Low Transaction Fees
            </h3>
            <p className="mb-3">
              Donations are processed through trusted global payment providers
              with competitive nonprofit rates.
            </p>
            <p className="mb-3">
              Yendaa covers ACH fees so organizations can receive bank donations{" "}
              <span className="text-primary">with no processing cost</span>.
            </p>
            <p>
              We also secure reduced nonprofit fees for credit cards and digital
              wallets, helping you keep more of every donation.
            </p>
          </div>
        </section>

        {/* ZERO PLATFORM FEES */}
        <section className="py-20">
          <div className="relative max-w-3xl mx-auto flex justify-center items-center">
            <img
              src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/6670348a3fdda05e794b4616_bg-2.png"
              loading="lazy"
              width="215"
              height="267"
              alt=""
              className="bg-2"
            />
            <img
              src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/66703248a7309ea792679228_bg-1.png"
              loading="lazy"
              width="211"
              height="297"
              alt=""
              className="bg-1"
            />
            <Card className="max-w-4xl mx-auto shadow-lg border-none z-10">
              <CardHeader>
                <div className="flex gap-6 items-center mb-3">
                  <img
                    src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/667044045def241a6891503f_free.svg"
                    loading="lazy"
                    width="64"
                    height="64"
                    alt=""
                    className="img-free"
                  />
                  <CardTitle>Zero platform fees</CardTitle>
                </div>
                <CardDescription className="mt-3">
                  Yendaa was built to strengthen African nonprofits — not charge
                  them.
                </CardDescription>
                <CardDescription className="mt-3">
                  Thanks to our philanthropic partners and donor tips,
                  nonprofits never pay a platform fee to use Yendaa.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  {[
                    "Quick, simple onboarding",
                    "Multiple donation options",
                    "Public nonprofit profile for visibility",
                    "Unlimited Causes and peer-to-peer fundraisers",
                    "Free support from real advisors",
                  ].map((item) => (
                    <li key={item} className="flex gap-2 items-center">
                      <CheckCircle className="text-primary w-5 h-5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#797777ff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      style={{ opacity: "1" }}
                    >
                      <path d="m12 12l6 6m-6 0l6-6" />
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>{" "}
                    No setup fees
                  </li>
                  <li className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#797777ff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      style={{ opacity: "1" }}
                    >
                      <path d="m12 12l6 6m-6 0l6-6" />
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>{" "}
                    No monthly fees
                  </li>
                  <li className="flex gap-2 items-center">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#797777ff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      style={{ opacity: "1" }}
                    >
                      <path d="m12 12l6 6m-6 0l6-6" />
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>{" "}
                    No platform fees
                  </li>
                  <li className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#797777ff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      style={{ opacity: "1" }}
                    >
                      <path d="m12 12l6 6m-6 0l6-6" />
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>{" "}
                    No contracts
                  </li>
                  <li className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#797777ff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      style={{ opacity: "1" }}
                    >
                      <path d="m12 12l6 6m-6 0l6-6" />
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>{" "}
                    No hidden costs
                  </li>
                </ul>
              </CardContent>
              <p className="py-3 text-bolder text-center">
                You focus on your mission. Yendaa handles the rest.
              </p>
            </Card>
          </div>
        </section>

        {/* DISBURSEMENT */}
        <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Disbursement Options
            </h3>
            <p className="mt-3">
              Yendaa offers secure, reliable disbursements directly to your
              nonprofit.
            </p>
            <p className="mt-3">
              Connect your bank account via Stripe to avoid all fees and receive
              funds automatically.
            </p>
          </div>
          <div className="relative flex justify-center items-center">
            <Card className="max-w-5xl border-none shadow-lg z-10">
              <CardHeader>
                <CardTitle className="text-[17px]">
                  Disbursement Details
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {/* Table Header */}
                <div className="grid grid-cols-3 border-b px-4 py-2 text-sm font-medium text-muted-foreground">
                  <span>Disbursement Method</span>
                  <span className="text-center">Frequency</span>
                  <span className="text-right">Fee</span>
                </div>

                {/* Table Rows */}
                <div className="divide-y text-sm">
                  <div className="grid grid-cols-3 px-4 py-3">
                    <span>Stripe (Bank Account)</span>
                    <span className="text-center">Weekly</span>
                    <span className="text-right font-medium">0%</span>
                  </div>

                  <div className="grid grid-cols-3 px-4 py-3">
                    <span>PayPal Grants</span>
                    <span className="text-center">Every 4–5 weeks</span>
                    <span className="text-right font-medium">0%</span>
                  </div>

                  <div className="grid grid-cols-3 px-4 py-3">
                    <span>For Good</span>
                    <span className="text-center">Every 4–6 weeks</span>
                    <span className="text-right font-medium">1.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <img
              src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/667035447f7dda49c39dae76_bg-3-p-500.png"
              loading="lazy"
              width="295"
              height="202"
              alt=""
              srcset="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/667035447f7dda49c39dae76_bg-3-p-500.png 500w, https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/667035447f7dda49c39dae76_bg-3.png 590w"
              sizes="(max-width: 479px) 100vw, 295px"
              className="bg-3"
            />
          </div>
        </section>

        {/* OPTIONAL DONATION */}
        <section className="py-20 max-w-3xl mx-auto">
          <div className="relative flex justify-center items-center">
            <img
              src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/6670372063dc58df744db688_bg-5.png"
              loading="lazy"
              width="258"
              height="228"
              alt=""
              className="bg-5"
            />
            <img
              src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/66703674a5a268dcdbfaccbb_bg-4.png"
              loading="lazy"
              width="206"
              height="304"
              alt=""
              className="bg-4"
            />
            <Card className="max-w-3xl border-none mx-auto shadow-lg z-10">
              <CardHeader>
                <div className="text-center flex items-center justify-center mb-4">
                  <img
                    src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/66704142825253257def9d6b_mission.svg"
                    loading="lazy"
                    width="64"
                    height="64"
                    alt=""
                    className="mission-img text-center"
                  />
                </div>
                <CardTitle className="text-center">
                  Optional Donor Tips: How We Sustain Yendaa
                </CardTitle>
                <CardDescription className="pt-4 text-center">
                  Because Yendaa does not charge nonprofits, we rely on optional
                  donor contributions to maintain the platform.
                </CardDescription>
                <CardDescription className="mt-3">
                  At checkout, donors are invited to add a small contribution to
                  support Yendaa’s technology — but this step is completely
                  optional.
                </CardDescription>
                <CardDescription className="mt-3">
                  All tips are 100% voluntary and tax-deductible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardTitle>More Money for Your Mission</CardTitle>
                <CardDescription className="mt-3">
                  A typical nonprofit raising $300,000 annually through online
                  donations (credit cards, PayPal, ACH, mobile wallets) can save
                  thousands of dollars per year using Yendaa instead of costly
                  fundraising platforms.
                </CardDescription>
                <CardDescription className="mt-3">
                  That money goes directly back into programs and community
                  impact.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10 items-start">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <Card className="border-none">
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-3">
                <AccordionItem
                  value="item-1"
                  className="rounded-md border px-4"
                >
                  <AccordionTrigger className="group flex items-center justify-between py-4 text-sm font-medium hover:no-underline w-full">
                    <span>Why is Yendaa free for nonprofits?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </AccordionTrigger>

                  <AccordionContent className="pb-4 text-sm text-muted-foreground">
                    Because we believe African nonprofits deserve world-class
                    fundraising tools without financial barriers.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="rounded-md border px-4"
                >
                  <AccordionTrigger className="group flex items-center justify-between py-4 text-sm font-medium hover:no-underline w-full">
                    <span>How does Yendaa make money?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </AccordionTrigger>

                  <AccordionContent className="pb-4 text-sm text-muted-foreground">
                    Through philanthropic partners and optional donor tips that
                    support our operations and technology.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-3"
                  className="rounded-md border px-4"
                >
                  <AccordionTrigger className="group flex items-center justify-between py-4 text-sm font-medium hover:no-underline w-full">
                    <span>Do I need a contract or subscription?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </AccordionTrigger>

                  <AccordionContent className="pb-4 text-sm text-muted-foreground">
                    No. Yendaa has no contracts and no monthly fees.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-4"
                  className="rounded-md border px-4"
                >
                  <AccordionTrigger className="group flex items-center justify-between py-4 text-sm font-medium hover:no-underline w-full">
                    <span>Can I use Yendaa only for one type of donation?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </AccordionTrigger>

                  <AccordionContent className="pb-4 text-sm text-muted-foreground">
                    Yes. You can use Yendaa for only card payments, only PayPal,
                    or all donation methods.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-5"
                  className="rounded-md border px-4"
                >
                  <AccordionTrigger className="group flex items-center justify-between py-4 text-sm font-medium hover:no-underline w-full">
                    <span>Do you offer onboarding support?</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </AccordionTrigger>

                  <AccordionContent className="pb-4 text-sm text-muted-foreground">
                    Yes — onboarding and support are always free.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Raise More Funds for Your Mission?
          </h2>
          <p className="my-3">
            Let’s grow generosity across Africa — together.
          </p>
          <div className="flex justify-center gap-2 mt-6">
            <Link to={"/signup"}>
              <Button size="lg" className="rounded-full px-10">
                Get started
              </Button>
            </Link>
            <Button size="lg" className="rounded-full px-10">
              View a Demo
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
