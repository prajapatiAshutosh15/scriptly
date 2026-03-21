"use client";
import { Typography, Card, Button, Tag, Space, Row, Col, Divider } from "antd";
import { EnvironmentOutlined, DollarOutlined, ClockCircleOutlined, RocketOutlined, HeartOutlined, CoffeeOutlined, GlobalOutlined, LaptopOutlined, MedicineBoxOutlined, BookOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;

const openings = [
  {
    title: "Senior Frontend Engineer",
    team: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    salary: "$150K - $200K",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    title: "Backend Engineer",
    team: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$140K - $190K",
    tags: ["Node.js", "PostgreSQL", "AWS"],
  },
  {
    title: "Product Designer",
    team: "Design",
    location: "Remote (Worldwide)",
    type: "Full-time",
    salary: "$120K - $160K",
    tags: ["Figma", "UI/UX", "Design Systems"],
  },
  {
    title: "Developer Advocate",
    team: "Community",
    location: "Remote (US/EU)",
    type: "Full-time",
    salary: "$110K - $150K",
    tags: ["Content", "Speaking", "Community"],
  },
  {
    title: "Content Marketing Manager",
    team: "Marketing",
    location: "Remote (Worldwide)",
    type: "Full-time",
    salary: "$100K - $140K",
    tags: ["SEO", "Content Strategy", "Analytics"],
  },
  {
    title: "Site Reliability Engineer",
    team: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$160K - $210K",
    tags: ["Kubernetes", "Terraform", "AWS"],
  },
];

const perks = [
  { icon: <LaptopOutlined style={{ fontSize: 24, color: "#2563eb" }} />, title: "Remote-First", desc: "Work from anywhere in the world" },
  { icon: <DollarOutlined style={{ fontSize: 24, color: "#2563eb" }} />, title: "Competitive Pay", desc: "Top-of-market salary & equity" },
  { icon: <MedicineBoxOutlined style={{ fontSize: 24, color: "#2563eb" }} />, title: "Health & Dental", desc: "Full coverage for you & family" },
  { icon: <CoffeeOutlined style={{ fontSize: 24, color: "#2563eb" }} />, title: "Unlimited PTO", desc: "Take the time you need" },
  { icon: <BookOutlined style={{ fontSize: 24, color: "#2563eb" }} />, title: "Learning Budget", desc: "$2,000/year for courses & books" },
  { icon: <GlobalOutlined style={{ fontSize: 24, color: "#2563eb" }} />, title: "Team Retreats", desc: "Bi-annual company offsites" },
];

export default function CareersPage() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(229,135,58,0.05) 100%)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <Title level={1} style={{ margin: 0, fontSize: 44, fontWeight: 800 }}>
          Join Our Team
        </Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 560, margin: "16px auto 0" }} type="secondary">
          Help us build the future of developer content. We&apos;re looking for passionate people who love creating great products.
        </Paragraph>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
        {/* Perks */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2}><HeartOutlined /> Why Scriptly?</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>Benefits that matter</Text>
        </div>
        <Row gutter={[16, 16]} style={{ marginBottom: 60 }}>
          {perks.map((perk, i) => (
            <Col xs={12} md={8} key={i}>
              <Card style={{ borderRadius: 16, textAlign: "center", height: "100%" }} size="small">
                <div style={{ marginBottom: 8 }}>{perk.icon}</div>
                <Text strong style={{ display: "block" }}>{perk.title}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{perk.desc}</Text>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        {/* Open Positions */}
        <div style={{ textAlign: "center", margin: "40px 0 32px" }}>
          <Title level={2}><RocketOutlined /> Open Positions</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>{openings.length} roles available</Text>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {openings.map((job, i) => (
            <Card
              key={i}
              hoverable
              style={{ borderRadius: 16 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <Title level={5} style={{ margin: 0 }}>{job.title}</Title>
                  <Space size={16} style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      <EnvironmentOutlined /> {job.location}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      <ClockCircleOutlined /> {job.type}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      <DollarOutlined /> {job.salary}
                    </Text>
                  </Space>
                  <div style={{ marginTop: 8 }}>
                    {(job.tags || []).map((tag) => (
                      <Tag key={tag} color="blue" style={{ borderRadius: 12, margin: "2px 4px 2px 0" }}>{tag}</Tag>
                    ))}
                  </div>
                </div>
                <Link href="/contact">
                  <Button type="primary" shape="round">Apply Now</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 60,
          padding: 48,
          textAlign: "center",
          background: "linear-gradient(135deg, #2563eb 0%, #e5873a 100%)",
          borderRadius: 20,
        }}>
          <Title level={3} style={{ color: "#fff", margin: 0 }}>Don&apos;t see the right role?</Title>
          <Paragraph style={{ color: "rgba(219,234,254,0.85)", marginTop: 8 }}>
            We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in mind.
          </Paragraph>
          <Link href="/contact">
            <Button size="large" shape="round" style={{
              marginTop: 12, background: "#fff", color: "#2563eb", border: "none", fontWeight: 600, height: 48, padding: "0 32px",
            }}>
              Get in Touch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
