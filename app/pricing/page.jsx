"use client";
import { Typography, Card, Button, Space, Row, Col, Divider, Tag, Collapse } from "antd";
import { CheckOutlined, CloseOutlined, CrownOutlined, ThunderboltOutlined, RocketOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;

const plans = [
  {
    name: "Free",
    icon: <ThunderboltOutlined style={{ fontSize: 28, color: "#2563eb" }} />,
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with blogging.",
    features: [
      { text: "Unlimited articles", included: true },
      { text: "Custom blog domain", included: true },
      { text: "Basic analytics", included: true },
      { text: "Community support", included: true },
      { text: "SEO optimization", included: true },
      { text: "RSS feed", included: true },
      { text: "Custom CSS", included: false },
      { text: "Newsletter integration", included: false },
      { text: "Priority support", included: false },
      { text: "Team collaboration", included: false },
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    icon: <CrownOutlined style={{ fontSize: 28, color: "#f59e0b" }} />,
    price: "$9",
    period: "/month",
    description: "For serious bloggers who want to grow their audience.",
    features: [
      { text: "Unlimited articles", included: true },
      { text: "Custom blog domain", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority support", included: true },
      { text: "SEO optimization", included: true },
      { text: "RSS feed", included: true },
      { text: "Custom CSS & themes", included: true },
      { text: "Newsletter integration", included: true },
      { text: "Remove Scriptly branding", included: true },
      { text: "Team collaboration", included: false },
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Team",
    icon: <RocketOutlined style={{ fontSize: 28, color: "#8b5cf6" }} />,
    price: "$29",
    period: "/month",
    description: "For teams and organizations publishing together.",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Up to 10 team members", included: true },
      { text: "Team analytics dashboard", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom integrations", included: true },
      { text: "SSO authentication", included: true },
      { text: "Content review workflow", included: true },
      { text: "API access", included: true },
      { text: "SLA guarantee", included: true },
      { text: "Invoice billing", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  { key: "1", label: "Can I switch plans anytime?", children: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, your current plan stays active until the end of the billing period." },
  { key: "2", label: "Is there a free trial for Pro?", children: "Yes, we offer a 14-day free trial for the Pro plan. No credit card required. You can explore all Pro features risk-free." },
  { key: "3", label: "What payment methods do you accept?", children: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans." },
  { key: "4", label: "Can I cancel my subscription?", children: "Absolutely. You can cancel your subscription at any time from your account settings. Your access continues until the end of the current billing period." },
  { key: "5", label: "Do you offer discounts for students?", children: "Yes! We offer a 50% discount on the Pro plan for verified students. Contact our support team with your student email to get started." },
  { key: "6", label: "What happens to my content if I downgrade?", children: "Your content is always yours. If you downgrade, all your articles remain published. You'll only lose access to premium features like custom CSS and newsletter tools." },
];

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(99,102,241,0.05) 100%)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <Title level={1} style={{ margin: 0, fontSize: 44, fontWeight: 800 }}>
          Simple, transparent pricing
        </Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 500, margin: "16px auto 0" }} type="secondary">
          Start for free. Upgrade when you&apos;re ready to unlock powerful features.
        </Paragraph>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        {/* Plans */}
        <Row gutter={[24, 24]} justify="center">
          {plans.map((plan, i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <Card
                style={{
                  borderRadius: 20,
                  height: "100%",
                  border: plan.popular ? "2px solid #2563eb" : undefined,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                  }}>
                    <Tag color="blue" style={{ borderRadius: 12, fontWeight: 600 }}>Most Popular</Tag>
                  </div>
                )}
                <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                  {plan.icon}
                  <div>
                    <Title level={4} style={{ margin: 0 }}>{plan.name}</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>{plan.description}</Text>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 42, fontWeight: 800 }}>{plan.price}</span>
                    <Text type="secondary">{plan.period}</Text>
                  </div>

                  <Link href="/signin">
                    <Button
                      type={plan.popular ? "primary" : "default"}
                      size="large"
                      block
                      shape="round"
                      style={{ height: 48, fontWeight: 600 }}
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <Divider style={{ margin: "8px 0" }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.features.map((f, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {f.included ? (
                          <CheckOutlined style={{ color: "#22c55e", fontSize: 14 }} />
                        ) : (
                          <CloseOutlined style={{ color: "#d1d5db", fontSize: 14 }} />
                        )}
                        <Text style={{ fontSize: 14, color: f.included ? undefined : "#9ca3af" }}>
                          {f.text}
                        </Text>
                      </div>
                    ))}
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* FAQ */}
        <div style={{ marginTop: 80, maxWidth: 700, margin: "80px auto 0" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={2}>Frequently Asked Questions</Title>
            <Text type="secondary" style={{ fontSize: 16 }}>Everything you need to know about our plans</Text>
          </div>
          <Collapse
            items={faqs}
            bordered={false}
            expandIconPosition="end"
            style={{ background: "transparent" }}
          />
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 60,
          padding: 48,
          textAlign: "center",
          background: "linear-gradient(135deg, #2563eb 0%, #6366f1 100%)",
          borderRadius: 20,
        }}>
          <Title level={3} style={{ color: "#fff", margin: 0 }}>Still have questions?</Title>
          <Paragraph style={{ color: "rgba(219,234,254,0.85)", marginTop: 8 }}>
            Our team is happy to help. Reach out and we&apos;ll get back to you within 24 hours.
          </Paragraph>
          <Space size={16} style={{ marginTop: 16 }}>
            <Link href="/contact">
              <Button size="large" shape="round" style={{
                background: "#fff", color: "#2563eb", border: "none", fontWeight: 600, height: 48, padding: "0 32px",
              }}>
                Contact Us
              </Button>
            </Link>
            <Link href="/write">
              <Button size="large" shape="round" ghost style={{
                borderColor: "#fff", color: "#fff", fontWeight: 600, height: 48, padding: "0 32px",
              }}>
                Start Free
              </Button>
            </Link>
          </Space>
        </div>
      </div>
    </div>
  );
}
