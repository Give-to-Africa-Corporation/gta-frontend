import { Footer } from "@/components/shared/Footer";
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
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, Mail, MapPin, PhoneCall } from "lucide-react";
import { useState } from "react";
import bgFlag5 from "../../public/images/flag7.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Basic validation
      if (Object.values(formData).some((value) => !value)) {
        throw new Error("Please fill in all fields");
      }

      // Show success state
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-brand-purple text-white py-16 md:py-24">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Have questions about our platform or need assistance? We're here
              to help.
            </p>
          </div>
        </section>

                      <div
  className="relative min-h-[80vh] bg-fixed bg-center bg-cover"
  style={{
    backgroundImage:
      `url(${bgFlag5})`,
  }}
>
  {/* Blur & Dark Overlay */}
  <div className="absolute inset-0 bg-gray-900/60"></div>
          <div className="relative z-50">
            {/* Contact Form Section */}
            <section className="py-16">
              <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Contact Form */}
                  <div>
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle>Get In Touch</CardTitle>
                        <CardDescription>
                          Fill out the form below and we'll get back to you as
                          soon as possible.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isSuccess ? (
                          <div className="text-center py-8">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                              <CheckCircle className="text-green-600 h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                              Message Sent!
                            </h3>
                            <p className="text-gray-600 mb-6">
                              Thank you for reaching out. We'll respond to your
                              inquiry shortly.
                            </p>
                            <Button
                              onClick={() => setIsSuccess(false)}
                              variant="outline"
                            >
                              Send Another Message
                            </Button>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                              <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                              </Alert>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <Input
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  placeholder="John Doe"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  placeholder="john@example.com"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subject">Subject</Label>
                              <Input
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="What's your message about?"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="message">Message</Label>
                              <Textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                                rows={6}
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                          </form>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Contact Info */}
                  <div className="text-white">
                    <h2 className="text-2xl font-bold mb-6">
                      Contact Information
                    </h2>
                    <div className="grid gap-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-brand-purple-light p-3 rounded-full">
                          <MapPin className="text-white h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Our Address</h3>
                          <p className="">
                            {/* 123 Nonprofit Street */}
                            4240 Kearny Mesa Road, Suite 120
                            <br />
                            {/* Giving City, 10001 */}
                            San Diego, CA 92111
                            <br />
                            United States
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-brand-purple-light p-3 rounded-full">
                          <Mail className="text-white h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Email Us</h3>
                          <p className="">
                            General Inquiries: info@2africa.org
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-brand-purple-light p-3 rounded-full">
                          <PhoneCall className="text-white h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Call Us</h3>
                          <p className="">
                            Phone: +1 (619) 566-2004
                            <br />
                            Toll Free: 1-800-FUNDRAISE
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-brand-purple-light p-3 rounded-full">
                          <Clock className="text-white h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Business Hours
                          </h3>
                          <p className="">
                            Monday - Friday: 9:00 AM - 6:00 PM EST
                            <br />
                            Saturday: 10:00 AM - 2:00 PM EST
                            <br />
                            Sunday: Closed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16">
              <div className="container-custom text-white">
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="">
                    Find quick answers to common questions about our platform.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto divide-y">
                  <div className="py-5">
                    <h3 className="text-xl font-semibold mb-2">
                      How do I get my NGO verified?
                    </h3>
                    <p className="">
                      After creating an account, you'll need to complete our
                      verification process by submitting required documents such
                      as your NGO registration certificate, proof of leadership,
                      and impact summary.
                    </p>
                  </div>
                  <div className="py-5">
                    <h3 className="text-xl font-semibold mb-2">
                      How long does verification take?
                    </h3>
                    <p className="">
                      The verification process typically takes 2-3 business
                      days. For more complex cases, it may take up to 5 business
                      days.
                    </p>
                  </div>
                  <div className="py-5">
                    <h3 className="text-xl font-semibold mb-2">
                      Are there fees for using the platform?
                    </h3>
                    <p className="">
                      No, we do not chart any fees to use the platform.
                    </p>
                  </div>
                  <div className="py-5">
                    <h3 className="text-xl font-semibold mb-2">
                      How do I receive the donations?
                    </h3>
                    <p className="">
                      Donations are transferred to your registered bank account
                      on a monthly basis, or when they reach a minimum threshold
                      of $100.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
