"use client";
import { Segmented } from "antd";

export default function ContentTabs({ options, value, onChange }) {
  return <Segmented options={options} value={value} onChange={onChange} style={{ marginBottom: 24 }} size="large" />;
}
