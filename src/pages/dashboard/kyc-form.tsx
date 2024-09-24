import phone from "phone";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import { PhoneInput } from "@clickpesa/components-library.inputs.phone-input";
import { Button } from "@/components/ui/button";
import ErrorComponent from "../../components/other/error-component";
import { useEffect, useState } from "react";
import { SelectInput } from "@clickpesa/components-library.inputs.select-input";
import { countries } from "@/shared/data/countries";
import { useGetKYC } from "@/pages/dashboard/services";
import Spinner from "@/components/other/spinner";

const validatePhoneNumber: any = async (phoneNumber: string) => {
  if (phoneNumber === null) {
    return {
      valid: false,
    };
  }
  return phone(phoneNumber);
};

const KycForm = ({
  publicKey,
  loading,
}: {
  publicKey: string;
  loading: boolean;
}) => {
  const form = Form.useFormInstance();
  const [isLoading, setLoading] = useState(false);
  const { kyc, kycError, kycLoading, kycRefetch } = useGetKYC(publicKey);

  useEffect(() => {
    if (kyc) {
      form.setFieldValue("email", kyc?.email);
      form.setFieldValue("first_name", kyc?.first_name);
      form.setFieldValue("last_name", kyc?.last_name);
      form.setFieldValue("phone", kyc?.phone);
      form.setFieldValue("country", kyc?.country);
      form.setFieldValue("city", kyc?.city);
      form.setFieldValue("physical_address", kyc?.physical_address);
    }
  }, [kyc]);

  if (kycLoading || isLoading)
    return (
      <div className="flex items-center justify-center h-24">
        <Spinner />
      </div>
    );

  if (kycError && kycError?.response?.status !== 404)
    return (
      <ErrorComponent
        message={"Something Went Wrong"}
        onClick={() => {
          setLoading(true);
          kycRefetch().finally(() => {
            setLoading(false);
          });
        }}
      />
    );

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-x-4">
        <Form.Item
          name="first_name"
          label="First Name"
          labelCol={{ span: 24 }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            marginBottom: ".7rem",
          }}
          rules={[{ message: "This field is required", required: true }]}
          className={`basic-text-input`}
        >
          <Input placeholder="Enter First Name" />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Last Name"
          labelCol={{ span: 24 }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            marginBottom: ".7rem",
          }}
          rules={[{ message: "This field is required", required: true }]}
          className={`basic-text-input`}
        >
          <Input placeholder="Enter Last Name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          labelCol={{ span: 24 }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            marginBottom: ".7rem",
          }}
          rules={[
            { message: "This field is required", required: true },
            { type: "email", message: "Invalid email address" },
          ]}
          className={`basic-text-input`}
        >
          <Input
            placeholder="Enter Email Address"
            type="email"
            disabled={!!kyc?.id}
          />
        </Form.Item>

        <PhoneInput
          name="phone"
          label="Mobile Number"
          placeholder="Enter Mobile Number"
          rules={[
            () => ({
              async validator(_: any, value: any) {
                const result: any = await validatePhoneNumber(`+${value}`);
                if (result.isValid) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Please enter a valid phone number!")
                );
              },
            }),
          ]}
        />

        <Form.Item
          name="physical_address"
          label="Physical Address"
          labelCol={{ span: 24 }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            marginBottom: ".7rem",
          }}
          className={`basic-text-input`}
        >
          <Input placeholder="Enter Physical Address" />
        </Form.Item>
        <Form.Item
          name="city"
          label="City"
          labelCol={{ span: 24 }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            marginBottom: ".7rem",
          }}
          rules={[{ message: "This field is required", required: true }]}
          className={`basic-text-input`}
        >
          <Input placeholder="Enter City" />
        </Form.Item>
        <SelectInput
          options={countries.map((country) => ({
            label: country?.name,
            value: country?.name,
          }))}
          name="country"
          label="Country"
          placeholder="Select Country"
        />
      </div>
      <Button className="w-full" disabled={loading}>
        {loading ? "Please Wait" : "Continue"}
      </Button>
    </div>
  );
};

export default KycForm;
