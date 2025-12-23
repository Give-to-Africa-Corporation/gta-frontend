// @ts-nocheck
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { NgoProfileResponse, UpdateProfileRequest } from "@/lib/types";
import { ngoApi } from "@/service/apiService";
import { Check, Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ProfileTab = () => {
  // State for profile data
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileData, setProfileData] = useState<NgoProfileResponse | null>(
    null
  );
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const [ngoData, setNgoData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    mission: "",
    profileImage: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Load profile data
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await ngoApi.getProfile();
      if (response.success && response.data) {
        setProfileData(response.data);

        // Update form data
        setNgoData({
          name: response.data.ngo.name || "",
          email: response.data.ngo.email || "",
          phone: response.data.ngo.contactPhone || "",
          website: response.data.ngo.website || "",
          mission: response.data.ngo.missionStatement || "",
          profileImage: response.data.ngo.profileImage || "",
          facebook: response.data.ngo.facebook || "",
          twitter: response.data.ngo.twitter || "",
          instagram: response.data.ngo.instagram || "",
          linkedin: response.data.ngo.linkedin || "",
        });
      } else {
        toast.error("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Error loading profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNgoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadingImage(true);

    try {
      const response = await ngoApi.uploadProfileImage(file);
      if (response.success && response.data) {
        setNgoData((prev) => ({
          ...prev,
          profileImage: response.data.profileImage,
        }));
        toast.success("Profile image uploaded successfully");
      } else {
        toast.error(response.error || "Failed to upload profile image");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("An error occurred while uploading your profile image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Map form fields to API request
      const updateData: UpdateProfileRequest = {
        name: ngoData.name,
        phoneNumber: ngoData.contactPhone,
        website: ngoData.website,
        description: ngoData.missionStatement,
        facebook: ngoData.facebook,
        twitter: ngoData.twitter,
        instagram: ngoData.instagram,
        linkedin: ngoData.linkedin,
      };

      // Add bank details if present in the profileData
      if (profileData?.ngo.bankDetails) {
        updateData.bankDetails = profileData.ngo.bankDetails;
      }

      // Keep existing values
      if (profileData?.ngo.orgName) {
        updateData.orgName = profileData.ngo.orgName;
      }

      if (profileData?.ngo.officialEmail) {
        updateData.officialEmail = profileData.ngo.officialEmail;
      }

      if (profileData?.ngo.country) {
        updateData.country = profileData.ngo.country;
      }

      const response = await ngoApi.updateProfile(updateData);

      if (response.success) {
        toast.success("Profile updated successfully");
        // Refresh profile data
        await fetchProfileData();
        setIsEditing(false);
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile values
    if (profileData) {
      setNgoData({
        name: profileData.ngo.name || "",
        email: profileData.ngo.email || "",
        phone: profileData.ngo.contactPhone || "",
        website: profileData.ngo.website || "",
        mission: profileData.ngo.missionStatement || "",
        profileImage: profileData.ngo.profileImage || "",
        facebook: profileData.ngo.facebook || "",
        twitter: profileData.ngo.twitter || "",
        instagram: profileData.ngo.instagram || "",
        linkedin: profileData.ngo.linkedin || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">Loading profile data...</div>
    );
  }

  const triggerProfileImageUpload = () => {
    if (profileImageInputRef.current) {
      profileImageInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>NGO Profile</CardTitle>
            <CardDescription>
              Manage your organization's public profile information
            </CardDescription>
          </div>
          {isEditing ? (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo Upload */}
              <div className="w-full md:w-1/3 space-y-4">
                <Label>Organization Logo</Label>
                <div className="flex flex-col items-center justify-center">
                  <Avatar className="h-32 w-32 mb-4">
                    {ngoData.profileImage ? (
                      <AvatarImage
                        src={
                          ngoData.profileImage.startsWith("http")
                            ? ngoData.profileImage
                            : `${import.meta.env.VITE_BE_URL}${
                                ngoData.profileImage
                              }`
                        }
                        alt="Profile"
                      />
                    ) : null}
                    <AvatarFallback>
                      {profileData?.ngo.name?.substring(0, 2).toUpperCase() ||
                        "NG"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={triggerProfileImageUpload}
                      disabled={!isEditing || uploadingImage}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Change Logo
                        </>
                      )}
                    </Button>
                    <input
                      ref={profileImageInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="w-full md:w-2/3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Organization Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={ngoData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={ngoData.email}
                      onChange={handleInputChange}
                      disabled={true} // Email should not be editable
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={ngoData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={ngoData.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div>
              <Label htmlFor="mission">Mission Statement</Label>
              <Textarea
                id="mission"
                name="mission"
                rows={4}
                value={ngoData.mission}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-lg font-medium mb-4">Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={ngoData.facebook}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex-1"
                    placeholder="username or full URL"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={ngoData.twitter}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex-1"
                    placeholder="username or full URL"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={ngoData.instagram}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex-1"
                    placeholder="username or full URL"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={ngoData.linkedin}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex-1"
                    placeholder="username or full URL"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Stats Card */}
      {profileData && (
        <Card>
          <CardHeader>
            <CardTitle>NGO Statistics</CardTitle>
            <CardDescription>
              Overview of your fundraising efforts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Causes</p>
                <p className="text-2xl font-bold">
                  {profileData.stats.totalCampaigns}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Ongoing Causes</p>
                <p className="text-2xl font-bold">
                  {profileData.stats.activeCampaigns}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Raised</p>
                <p className="text-2xl font-bold">
                  ${profileData.stats.totalRaised.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Unique Donors</p>
                <p className="text-2xl font-bold">
                  {profileData.stats.uniqueDonors}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>Your organization has been verified</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center bg-green-50 p-4 rounded-lg">
            <div className="mr-4 bg-green-100 rounded-full p-2">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Your NGO is verified</p>
              <p className="text-sm text-gray-600">
                Verified on July 15, 2023. Your verification is valid for 2
                years.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
