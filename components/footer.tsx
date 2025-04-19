import { Link } from "@heroui/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex items-center justify-center py-3">
      <span className="text-default-600">© {currentYear} NullUnit. All rights reserved.</span>
      {/* Você pode adicionar mais links aqui se desejar, por exemplo:
      <Link
        isExternal
        className="flex items-center gap-1 text-current"
        href="/privacy-policy"
        title="Privacy Policy"
      >
        <span className="text-default-600">Privacy Policy</span>
      </Link>
      */}
    </footer>
  );
}; 