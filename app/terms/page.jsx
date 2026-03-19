"use client";
import { Typography, Divider, Anchor, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using Scriptly, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of modified terms.`,
  },
  {
    id: "accounts",
    title: "2. User Accounts",
    content: `You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and password. You must be at least 13 years old to use Scriptly. One person or entity may not maintain more than one free account.`,
  },
  {
    id: "content",
    title: "3. User Content",
    content: `You retain ownership of all content you publish on Scriptly. By publishing, you grant Scriptly a non-exclusive license to display, distribute, and promote your content on our platform. You are responsible for ensuring your content does not violate any laws or third-party rights.`,
  },
  {
    id: "prohibited",
    title: "4. Prohibited Content",
    content: `You may not publish content that is illegal, defamatory, harassing, or promotes violence. Spam, automated content, and plagiarized material are strictly prohibited. We reserve the right to remove any content that violates these guidelines and suspend accounts that repeatedly violate our policies.`,
  },
  {
    id: "intellectual-property",
    title: "5. Intellectual Property",
    content: `Scriptly and its original content, features, and functionality are owned by Scriptly Inc. Our trademarks and trade dress may not be used in connection with any product or service without prior written consent. You may not copy, modify, or reverse engineer any part of our platform.`,
  },
  {
    id: "payments",
    title: "6. Payments & Subscriptions",
    content: `Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We may change our fees upon 30 days notice. Downgrading may cause loss of features but never loss of content.`,
  },
  {
    id: "termination",
    title: "7. Termination",
    content: `You may terminate your account at any time from your account settings. We may terminate or suspend your account if you violate these terms. Upon termination, your right to use the platform ceases, but your published content may remain accessible unless you delete it prior to termination.`,
  },
  {
    id: "limitation",
    title: "8. Limitation of Liability",
    content: `Scriptly is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.`,
  },
  {
    id: "governing-law",
    title: "9. Governing Law",
    content: `These terms shall be governed by the laws of the State of California, United States. Any disputes shall be resolved in the courts of San Francisco County, California. If any provision is found unenforceable, the remaining provisions continue in effect.`,
  },
];

export default function TermsPage() {
  return (
    <div>
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(229,135,58,0.05) 100%)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <Title level={1} style={{ margin: 0, fontSize: 44, fontWeight: 800 }}>Terms of Service</Title>
        <Paragraph style={{ fontSize: 16, margin: "12px auto 0" }} type="secondary">
          Last updated: March 1, 2026
        </Paragraph>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
          Welcome to Scriptly. Please read these terms carefully before using our platform. These terms govern your use of Scriptly and all associated services.
        </Paragraph>

        <Row gutter={[48, 0]}>
          <Col xs={24} md={18}>
            {sections.map((section, i) => (
              <div key={section.id} id={section.id} style={{ marginBottom: 40 }}>
                <Title level={3}>{section.title}</Title>
                <Paragraph style={{ fontSize: 15, lineHeight: 1.8 }}>{section.content}</Paragraph>
                {i < sections.length - 1 && <Divider />}
              </div>
            ))}
          </Col>
          <Col xs={0} md={6}>
            <div style={{ position: "sticky", top: 80 }}>
              <Anchor
                items={sections.map((s) => ({ key: s.id, href: `#${s.id}`, title: s.title.replace(/^\d+\.\s/, "") }))}
                offsetTop={80}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
