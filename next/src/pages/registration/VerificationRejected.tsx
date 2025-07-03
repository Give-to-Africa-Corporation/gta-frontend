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
import { AlertCircle, FileX, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerificationRejected = () => {
  const navigate = useNavigate();
  const { user, ngos, logout } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);

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
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Verification Rejected</CardTitle>
              <CardDescription className="text-lg">
                Your NGO registration was not approved
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800">
                  We regret to inform you that your NGO registration application
                  has been rejected. This could be due to incomplete
                  documentation, verification issues, or not meeting our
                  platform's requirements.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <FileX className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Next Steps</h3>
                    <p className="text-gray-600 text-sm">
                      You can review your application and submit a new one with
                      updated information and documents. Please ensure all
                      required documents are complete and valid.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <RefreshCw className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Need Help?</h3>
                    <p className="text-gray-600 text-sm">
                      If you believe this was an error or need assistance,
                      please contact our support team.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col space-y-3">
                {/* <Button
                  onClick={handleCheckStatus}
                  disabled={refreshing}
                  className="w-full"
                >
                  {refreshing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Checking status...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Check Status
                    </>
                  )}
                </Button> */}
                <Button
                  variant="outline"
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

export default VerificationRejected;
