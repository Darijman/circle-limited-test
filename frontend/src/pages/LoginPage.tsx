import { Button, Form, Input, message, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth.api";
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";
import type { AxiosError } from "axios";

const { Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { refetchUser } = useAuth();
  const navigate = useNavigate();

  const [form] = Form.useForm<LoginFormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 2,
    duration: 3,
  });

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      await login(values);
      await refetchUser();

      navigate("/");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;

      messageApi.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 400, margin: "100px auto" }}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email format" },
            { max: 255, message: "Email is too long" },
          ]}
        >
          <Input
            placeholder="Enter email"
            maxLength={255}
            onChange={(e) => {
              form.setFieldsValue({
                email: e.target.value.trim().toLowerCase(),
              });
            }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 6, message: "Password must be at least 6 characters" },
            { max: 100, message: "Password is too long" },
            {
              pattern: /^[^\s]+$/,
              message: "Password must not contain spaces",
            },
          ]}
        >
          <Input.Password placeholder="Enter password" maxLength={100} />
        </Form.Item>

        <Button loading={loading} type="primary" htmlType="submit" block>
          Login
        </Button>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Text>
            No account? <Link to="/register">Register</Link>
          </Text>
        </div>
      </Form>
    </>
  );
}
