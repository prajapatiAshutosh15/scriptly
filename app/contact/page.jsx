"use client";
import { Typography, Card, Input, Button, Row, Col, Space, message } from "antd";
import { MailOutlined, EnvironmentOutlined, PhoneOutlined, SendOutlined, GithubOutlined, TwitterOutlined, LinkedinOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    message.success("Message sent successfully! We'll get back to you soon. (Demo)");
  };

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(229,135,58,0.05) 100%)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <Title level={1} style={{ margin: 0, fontSize: 44, fontWeight: 800 }}>Get in Touch</Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 500, margin: "16px auto 0" }} type="secondary">
          Have a question, feedback, or partnership inquiry? We&apos;d love to hear from you.
        </Paragraph>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
        <Row gutter={[48, 48]}>
          {/* Contact Form */}
          <Col xs={24} md={14}>
            <Card style={{ borderRadius: 20 }}>
              <Title level={4} style={{ marginBottom: 24 }}>Send us a message</Title>
              <form onSubmit={handleSubmit}>
                <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>First Name</label>
                      <Input placeholder="John" size="large" style={{ borderRadius: 10 }} />
                    </Col>
                    <Col xs={24} sm={12}>
                      <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Last Name</label>
                      <Input placeholder="Doe" size="large" style={{ borderRadius: 10 }} />
                    </Col>
                  </Row>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Email</label>
                    <Input placeholder="john@example.com" size="large" style={{ borderRadius: 10 }} prefix={<MailOutlined />} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Subject</label>
                    <Input placeholder="How can we help?" size="large" style={{ borderRadius: 10 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Message</label>
                    <TextArea placeholder="Tell us more..." rows={5} style={{ borderRadius: 10, resize: "none" }} />
                  </div>
                  <Button type="primary" size="large" shape="round" icon={<SendOutlined />} htmlType="submit" style={{ height: 48, padding: "0 32px", fontWeight: 600 }}>
                    Send Message
                  </Button>
                </Space>
              </form>
            </Card>
          </Col>

          {/* Contact Info */}
          <Col xs={24} md={10}>
            <Space orientation="vertical" size={24} style={{ width: "100%" }}>
              <Card style={{ borderRadius: 16 }}>
                <Space size={16}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MailOutlined style={{ fontSize: 20, color: "#2563eb" }} />
                  </div>
                  <div>
                    <Text strong>Email</Text>
                    <div><Text type="secondary" style={{ fontSize: 13 }}>support@scriptly.dev</Text></div>
                  </div>
                </Space>
              </Card>

              <Card style={{ borderRadius: 16 }}>
                <Space size={16}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <EnvironmentOutlined style={{ fontSize: 20, color: "#2563eb" }} />
                  </div>
                  <div>
                    <Text strong>Address</Text>
                    <div><Text type="secondary" style={{ fontSize: 13 }}>123 Developer Ave, San Francisco, CA 94102</Text></div>
                  </div>
                </Space>
              </Card>

              <Card style={{ borderRadius: 16 }}>
                <Space size={16}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PhoneOutlined style={{ fontSize: 20, color: "#2563eb" }} />
                  </div>
                  <div>
                    <Text strong>Phone</Text>
                    <div><Text type="secondary" style={{ fontSize: 13 }}>+1 (555) 123-4567</Text></div>
                  </div>
                </Space>
              </Card>

              <Card style={{ borderRadius: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 12 }}>Follow Us</Text>
                <Space size={12}>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Button shape="circle" icon={<TwitterOutlined />} size="large" />
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Button shape="circle" icon={<GithubOutlined />} size="large" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Button shape="circle" icon={<LinkedinOutlined />} size="large" />
                  </a>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
}
