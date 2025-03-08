"use client"; // Since we are using context, it must be a client component
import { ConfigProvider } from "../context/ConfigContext";

export default function Providers({ children }) {
  return <ConfigProvider>{children}</ConfigProvider>;
}
