import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { ClipboardCheck, Clock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerificationPending = () => {
  const navigate = useNavigate();
  const { user, ngos, logout } = useAppContext();
  const [timeLeft, setTimeLeft] = useState("...");
  const [refreshing, setRefreshing] = useState(false);

  // Calculate estimated time for review
  useEffect(() => {
    // Mock calculation - in a real app this would come from the server
    const estimatedMinutes = Math.floor(Math.random() * 60) + 30; // 30-90 minutes
    setTimeLeft(`${estimatedMinutes} minutes`);
  }, []);

  const handleCheckStatus = async () => {
    setRefreshing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if NGO status has changed
    if (user?.id) {
      const ngo = ngos.find((n) => n.id === user.id);
      if (ngo?.status === "approved") {
        // Refresh user session
        window.location.href = "/dashboard";
      }
    }

    setRefreshing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-lg">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl">Verification Pending</CardTitle>
              <CardDescription className="text-lg">
                Your NGO registration is under review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-amber-800">
                  Thank you for submitting your registration. Our team is
                  reviewing your application and documents. This process
                  typically takes 24-48 hours.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <ClipboardCheck className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Review Process</h3>
                    <p className="text-gray-600 text-sm">
                      Our verification team will review your submitted documents
                      and may contact you if additional information is needed.
                      We'll notify you of the approval or rejection via email.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Check Your Email</h3>
                    <p className="text-gray-600 text-sm">
                      Please check your email inbox for updates regarding your
                      verification status. Don't forget to check your spam/junk
                      folder as well. The email will contain detailed
                      information about your approval or rejection status.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col space-y-3">
                <Button
                  variant="default"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerificationPending;
