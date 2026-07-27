import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { productService } from "../../services/productService";
import { authService } from "../../services/authService";
import { useTranslation } from "react-i18next";

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, users: 0 });
  const { t } = useTranslation();

  useEffect(() => {
    productService
      .getAll()
      .then((res) =>
        setStats((prev) => ({ ...prev, products: res.data.length })),
      )
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3">
            VHX Store
          </p>
          <h1
            style={{ fontFamily: '"Bebas Neue",sans-serif' }}
            className="text-6xl tracking-widest text-white mb-2"
          >
            {t("admin.title")}
          </h1>
          <p className="text-white/30 text-sm">
            {t("admin.welcome")}, {user?.name}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {[
            { label: t("admin.products"), value: stats.products, icon: "📦" },
            { label: t("admin.categories"), value: 4, icon: "🏷️" },
            { label: t("admin.api_status"), value: "Online", icon: "✅" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-[#111] rounded-sm p-6">
              <p className="text-2xl mb-3">{icon}</p>
              <p
                style={{ fontFamily: '"Bebas Neue",sans-serif' }}
                className="text-4xl tracking-wider text-[#C8F135] mb-1"
              >
                {value}
              </p>
              <p className="text-xs tracking-widest uppercase text-white/30">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Ações rápidas */}
        <div className="mb-6">
          <p
            style={{ fontFamily: '"Bebas Neue",sans-serif' }}
            className="text-2xl tracking-widest text-white mb-4"
          >
            {t("admin.manage")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/produtos"
              className="bg-[#111] rounded-sm p-6 hover:bg-[#1a1a1a] transition-colors group flex items-center justify-between"
            >
              <div>
                <p
                  style={{ fontFamily: '"Bebas Neue",sans-serif' }}
                  className="text-xl tracking-widest text-white group-hover:text-[#C8F135] transition-colors mb-1"
                >
                  {t("admin.products")}
                </p>
                <p className="text-xs tracking-widest uppercase text-white/30">
                  {t("admin.products_sub")}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white/20 group-hover:text-[#C8F135] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>

            <Link
              to="/produtos"
              className="bg-[#111] rounded-sm p-6 hover:bg-[#1a1a1a] transition-colors group flex items-center justify-between"
            >
              <div>
                <p
                  style={{ fontFamily: '"Bebas Neue",sans-serif' }}
                  className="text-xl tracking-widest text-white group-hover:text-[#C8F135] transition-colors mb-1"
                >
                  {t("admin.see_store")}
                </p>
                <p className="text-xs tracking-widest uppercase text-white/30">
                  {t("admin.see_store_sub")}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white/20 group-hover:text-[#C8F135] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              to="/admin/cupons"
              className="group flex items-center justify-between rounded-sm bg-[#111] p-6 transition-colors hover:bg-[#1a1a1a]"
            >
              <div>
                <p
                  style={{
                    fontFamily: '"Bebas Neue",sans-serif',
                  }}
                  className="mb-1 text-xl tracking-widest text-white transition-colors group-hover:text-[#C8F135]"
                >
                  Cupons
                </p>

                <p className="text-xs uppercase tracking-widest text-white/30">
                  Criar e gerenciar descontos
                </p>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/20 transition-colors group-hover:text-[#C8F135]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
