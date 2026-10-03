import { AccountNav } from "@/components/account-nav";

export default function MessagesLayout({ children }: LayoutProps<"/messages">) {
  return (
    <div className="container-page py-10">
      <AccountNav />
      <div className="mt-8">{children}</div>
    </div>
  );
}
