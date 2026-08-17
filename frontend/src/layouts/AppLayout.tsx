import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";

function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to={isAdmin ? "/admin" : "/chat"} className="text-xl font-bold">
            OrgAssist
          </Link>

          <nav className="flex items-center gap-2">
            {isAdmin && (
              <>
                <Button
                  variant={location.pathname === "/admin" ? "secondary" : "ghost"}
                  asChild
                >
                  <Link to="/admin">Dashboard</Link>
                </Button>

                <Button
                  variant={
                    location.pathname === "/employees"
                      ? "secondary"
                      : "ghost"
                  }
                  asChild
                >
                  <Link to="/employees">Employees</Link>
                </Button>
              </>
            )}

            <Button
              variant={location.pathname === "/chat" ? "secondary" : "ghost"}
              asChild
            >
              <Link to="/chat">Assistant</Link>
            </Button>

            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <Outlet />
    </div>
  );
}

export default AppLayout;