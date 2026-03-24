"use client";
import { Typography, Card, Avatar, Space, Row, Col, Divider } from "antd";
import { TeamOutlined, RocketOutlined, GlobalOutlined, HeartOutlined, CodeOutlined, SafetyOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;

const team = [
  { name: "Alex Morgan", role: "CEO & Co-Founder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexm", bio: "Former engineering lead at Google. Passionate about developer tools." },
  { name: "Jessica Lee", role: "CTO & Co-Founder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jessica", bio: "Built distributed systems at AWS. Open source contributor." },
  { name: "Ryan Patel", role: "Head of Design", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ryanp", bio: "Previously design lead at Figma. Loves clean, minimal interfaces." },
  { name: "Sofia Garcia", role: "Head of Community", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia", bio: "Community builder. Organized 50+ developer conferences worldwide." },
  { name: "David Kim", role: "Lead Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=davidk", bio: "Full-stack developer with 12 years of experience. React core contributor." },
  { name: "Emma Wilson", role: "Head of Marketing", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emmaw", bio: "Growth expert. Previously scaled developer products at Vercel." },
];

const values = [
  { icon: <CodeOutlined style={{ fontSize: 28, color: "#2563eb" }} />, title: "Developer First", desc: "Everything we build starts with developers in mind. Our platform is crafted by developers, for developers." },
  { icon: <GlobalOutlined style={{ fontSize: 28, color: "#2563eb" }} />, title: "Open & Inclusive", desc: "We believe knowledge should be accessible to everyone, everywhere. No paywalls on reading." },
  { icon: <HeartOutlined style={{ fontSize: 28, color: "#2563eb" }} />, title: "Community Driven", desc: "Our community shapes our roadmap. We listen, iterate, and build together." },
  { icon: <SafetyOutlined style={{ fontSize: 28, color: "#2563eb" }} />, title: "Privacy Focused", desc: "Your data belongs to you. We never sell user data or track you across the web." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(229,135,58,0.05) 100%)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <Title level={1} style={{ margin: 0, fontSize: 44, fontWeight: 800 }}>
          About TLE.ai
        </Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 600, margin: "16px auto 0" }} type="secondary">
          We&apos;re building the home for developer content on the internet — a place where ideas thrive and knowledge flows freely.
        </Paragraph>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        {/* Mission */}
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={12}>
            <Title level={2}>Our Mission</Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              TLE.ai was founded in 2024 with a simple mission: give every developer a voice. We believe that writing makes you a better thinker, and sharing makes the entire community stronger.
            </Paragraph>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              Our growing community of developers uses TLE.ai to publish articles, ask and answer technical questions, and build their personal brand. We're just getting started, and every new voice makes the community stronger.
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&q=80"
              alt="Team collaboration"
              style={{ width: "100%", borderRadius: 16, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
            />
          </Col>
        </Row>

        <Divider style={{ margin: "60px 0" }} />

        {/* Values */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Title level={2}>Our Values</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>The principles that guide everything we do</Text>
        </div>
        <Row gutter={[24, 24]}>
          {values.map((v, i) => (
            <Col xs={24} sm={12} key={i}>
              <Card style={{ borderRadius: 16, height: "100%" }}>
                <Space orientation="vertical" size={12}>
                  {v.icon}
                  <Title level={4} style={{ margin: 0 }}>{v.title}</Title>
                  <Text type="secondary">{v.desc}</Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider style={{ margin: "60px 0" }} />

        {/* Platform Highlights */}
        <Row gutter={[24, 24]} style={{ textAlign: "center", marginBottom: 60 }}>
          {[
            { title: "Questions & Answers", label: "Get help from real developers" },
            { title: "Technical Blogs", label: "Share your knowledge and tutorials" },
            { title: "Community Driven", label: "Built by developers, for developers" },
            { title: "Open to All", label: "Free to read, write, and participate" },
          ].map((s, i) => (
            <Col xs={12} md={6} key={i}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>{s.title}</div>
              <Text type="secondary">{s.label}</Text>
            </Col>
          ))}
        </Row>

        <Divider style={{ margin: "60px 0" }} />

        {/* Team */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Title level={2}><TeamOutlined /> Meet the Team</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>The people building TLE.ai</Text>
        </div>
        <Row gutter={[24, 24]}>
          {team.map((member, i) => (
            <Col xs={24} sm={12} md={8} key={i}>
              <Card style={{ borderRadius: 16, textAlign: "center" }}>
                <Avatar src={member.avatar} size={80} style={{ marginBottom: 16 }}>{member.name?.[0] || "U"}</Avatar>
                <Title level={5} style={{ margin: 0 }}>{member.name}</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>{member.role}</Text>
                <Paragraph type="secondary" style={{ marginTop: 8, fontSize: 13 }}>{member.bio}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        {/* CTA */}
        <div style={{
          marginTop: 60,
          padding: 48,
          textAlign: "center",
          background: "linear-gradient(135deg, #2563eb 0%, #e5873a 100%)",
          borderRadius: 20,
        }}>
          <Title level={3} style={{ color: "#fff", margin: 0 }}>Ready to start writing?</Title>
          <Paragraph style={{ color: "rgba(219,234,254,0.85)", marginTop: 8 }}>
            Join a growing community of developers sharing their knowledge on TLE.ai.
          </Paragraph>
          <Link href="/write">
            <button style={{
              marginTop: 16,
              padding: "14px 40px",
              background: "#fff",
              color: "#2563eb",
              border: "none",
              borderRadius: 24,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}>
              Start Your Blog
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
